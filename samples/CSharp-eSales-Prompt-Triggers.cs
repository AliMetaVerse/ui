using Microsoft.Extensions.AI;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using System.ComponentModel;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
 
 
class Program
{

 
    static async Task Main(string[] args)
    {
        var hostBuilder = Host.CreateApplicationBuilder();
 
        IChatClient innerChatClient = new AzureOpenAIClient(new Uri(openAiEndpoint), new System.ClientModel.ApiKeyCredential(openAiApiKey)).AsChatClient(deploymentName);
 
        hostBuilder.Services.AddChatClient(innerChatClient).UseFunctionInvocation();
 
        var app = hostBuilder.Build();
        var chatClient = app.Services.GetRequiredService<IChatClient>();
 
        var videos = GetVideosJson();
        // Start the conversation with context for the AI model
        List<ChatMessage> chatHistory = new()
        {
            new ChatMessage(ChatRole.System, 
            $"Your primary role is to assist users with creating and managing surveys on Webropol. You provide clear, concise, and direct answers based on the uploaded manuals, helping users design effective survey questions and navigate the Webropol platform efficiently." +
            $"When responding to inquiries: Offer precise answers from the manuals whenever possible." +
            $"If a question is unclear or lacks detail, ask clarifying questions to ensure the guidance is relevant and effective." +
            $"Keep responses compact and focused, making information easy to understand and apply." +
            $"Avoid login or authentication instructions, as the user is already authenticated." +
            $"Your goal is to empower users to maximize Webropol’s potential with confidence." +
            $"If users need further assistance, they can contact Customer Care (customercare@webropol.fi) for support or Sales (sales@webropol.fi) for business inquiries." +
            $"Most important thing is to keep answer as short as possible")
        };
 
        while (true)
        {
            // Get user prompt and add to chat history
            Console.WriteLine("Your prompt:");
            var userPrompt = Console.ReadLine();
 
            // Step 1: Retrieve relevant documents from Azure Cognitive Search
            List<string> relevantDocs = await RetrieveRelevantDocsAsync(userPrompt);
 
            userPrompt += "\n Answer questions based on the following documentation:" + string.Join("\n", relevantDocs);
 
            chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));
 
            if (relevantDocs.Count == 0)
            {
                Console.WriteLine("No relevant documents found.");
                return;
            }
 
            // Stream the AI response and add to chat history
            Console.WriteLine("AI Response:");
            var response = "";
 
            var tools = new List<AITool>
            {
                AIFunctionFactory.Create(EsaleAiTextAnalysis),
                AIFunctionFactory.Create(Esale360),
                AIFunctionFactory.Create(EsaleCaseManagement)
            };
 
 
            var chatOptions = new ChatOptions
            {
                Tools = tools,
                ToolMode = ChatToolMode.Auto
            };
 
            await foreach (var item in chatClient.GetStreamingResponseAsync(chatHistory, chatOptions))
            {
                Console.Write(item.Text);
                response += item.Text;
            }
 
            chatHistory.Add(new ChatMessage(ChatRole.Assistant, response));
            Console.WriteLine();
        }
    }
 
    static async Task<List<string>> RetrieveRelevantDocsAsync(string query)
    {
        var searchClient = new SearchClient(
                new Uri(searchServiceEndpoint),
                searchIndexName,
                new Azure.AzureKeyCredential(searchApiKey));
 
        var searchOptions = new SearchOptions
        {
            Size = 3, // Retrieve top 3 results
            QueryType = SearchQueryType.Simple,
            Select = { "content" },
        };
 
        SearchResults<SearchDocument> response = await searchClient.SearchAsync<SearchDocument>(query, searchOptions);
 
        foreach (var (item, index) in response.GetResults().Select((x, i) => (x.Document["content"], i)))
        {
            Console.ForegroundColor = ConsoleColor.DarkGreen;
            Console.WriteLine($"source #{index + 1}: {item}");
            Console.ResetColor();
        }
 
        return response.GetResults()
                       .Select(result => result.Document["content"]?.ToString() ?? "")
                       .ToList();
    }
 
    public static string GetVideosJson()
    {
        var videos = new
        {
            videos = new[]
            {
                new { title = "Creating a Survey", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/02bf717d-f08b-454e-9271-98076feca814\">Creating a Survey</a>" },
                new { title = "Reporting", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/0d10adf0-ee28-486c-8cbe-a20a0b9af82f\">Reporting</a>" },
                new { title = "Events Management", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/5249e408-540b-4a5d-a93b-350a0a6ec070\">Events Management</a>" },
                new { title = "Events Management - QR Code Ticket", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/3118297c-b741-445c-a06d-5dcd704cdd0b\">Events Management - QR Code Ticket</a>" },
                new { title = "Paytrail - Online Payment Integration", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/f5f8abdb-a867-4d61-ad57-1fce7426a01e\">Paytrail - Online Payment Integration</a>" },
                new { title = "Direct - Continuous Mobile Feedback", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/0c8ee1f8-b19c-4226-90d6-fb1dbf698571\">Direct - Continuous Mobile Feedback</a>" },
                new { title = "Suomi.fi Messages Integration", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/9498597b-04c7-45f0-bd28-c969037745b5\">Suomi.fi Messages Integration</a>" },
                new { title = "BI View - Dashboard Creation", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/50a9a732-0c9e-4f04-9c0a-fc9499e4a2d1\">BI View - Dashboard Creation</a>" },
                new { title = "AI Text Analysis", url = "<a href=\"https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/99b46d1d-deee-4550-9f41-32a9a047f6bd\">AI Text Analysis</a>" }
            }
        };
 
        return JsonSerializer.Serialize(videos, new JsonSerializerOptions { WriteIndented = true });
    }
 
 
    // ESALES HINTS
 
    [Description("Trigger if the user asks about AI-based text analysis, open-ended question analysis, or handling a large number of responses.")]
    static string EsaleAiTextAnalysis()
    {
        return GetESalesHint("AI Text analysis", "Ready-to-Use Solution\r\nA results dashboard professionally designed and equipped with essential analyses for quick interpretation.\r\n\r\nSimply Efficient\r\nA clear user interface that highlights truly important information effectively.\r\n\r\nImmediate Benefits\r\nEffortless analysis of even large volumes of text in an instant.\r\n\r\nSeamless Impact\r\nData and results can be easily shared across your organization via the BI View data center, Webropol reports, or various file formats.", 666, "https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/99b46d1d-deee-4550-9f41-32a9a047f6bd");               
    }
    [Description("Trigger if the user asks about managing customer complaints, feedback, or turning survey responses into action items.")]
    static string EsaleCaseManagement()
    {
        return GetESalesHint("Case Management", "An easy-to-use case management system saves time, effort, and money. With Webropol Case Management, you can streamline the processing and tracking of feedback forms, such as complaints. Regardless of the industry, Webropol’s case management can be seamlessly adapted to your organization's processes.", 777, "https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/99b46d1d-deee-4550-9f41-32a9a047f6bd");
    }
 
    [Description("Trigger if the user asks about 360-degree assessments or performance reviews.")]
    static string Esale360()
    {
        return GetESalesHint("360-degree assessments", "In today's ever-changing world, supporting employee development and growth is essential. Webropol 360 Survey enables employee assessment from multiple perspectives – as a colleague, supervisor, and team member. With 360-degree evaluation, you can maintain and enhance workplace well-being while measuring professional development.", 888, "https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/99b46d1d-deee-4550-9f41-32a9a047f6bd");
    }
 
    static string GetESalesHint(string productName, string description, int price, string videoUrl)
    {
        return $"Product name: '{productName}'," +
               $"Description: '{description}'" +
               $"Price: '{price}'" +
               $"Video url: '{videoUrl}'" +
               $"How to buy: 'Contact sales via email, TURBOSALES@webropol.fi' or from w-store (create link tag: /Shop/Wstore?page=Home )";
    }
 
}