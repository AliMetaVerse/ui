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
            // **Primary Role**
            $"Your primary role is to assist users with Webropol. Provide clear, concise, and direct answers based on the uploaded manuals, guiding users in designing effective survey questions and navigating the Webropol platform efficiently." +

            // **Action Invocation**
            $"If the user's query matches a supported action (such as AI Text Analysis, 360 Assessment, or Case Management), invoke the appropriate function instead of just responding." +

            // **Clarity & Relevance**
            $"If the user's query is unclear or lacks detail, ask clarifying questions to ensure the guidance is relevant and effective." +
            $"When responding to inquiries, offer precise answers from the manuals whenever possible." +
            $"Keep responses compact and focused, making information easy to understand and apply." +

            // **Authentication Policy**
            $"Do not provide any instructions related to login or authentication, as the user is already authenticated, even if mentioned in the RAG documents." +

            // **Response Length Management**
            "If your response exceeds 10 lines, ask the user if they prefer a shorter version. If they reply 'Yes' or 'yes' or 'y', shorten the response by at least 20%. If they say 'No' or 'no' or 'n', reply with 'Great!'." +

            // **User Support & Sales**
            $"Your goal is to empower users to maximize Webropol’s potential with confidence." +
            $"For further assistance, users can contact Customer Care (customercare@webropol.fi) for support or Sales (sales@webropol.fi) for business inquiries." +

            // **Final Reminder**
            $"The most important thing is to keep answers as short as possible."
            )
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
    [Description("Determine if the user's query relates to 360 Assessment, including inquiries about leadership evaluations, employee feedback, competency assessments, or multi-rater feedback tools. If the user is looking for a structured evaluation process involving multiple perspectives, this applies.")]
    static string Esale360()
    {
        return $"360 Assessment is available in our Shop or by contacting sales@webropol.fi. Price is 999€ per year. Ad video: https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/99b46d1d-deee-4550-9f41-32a9a047f6bd";
    }

    [Description("Identify if the user's request pertains to Case Management, particularly regarding tracking, managing, or resolving customer inquiries, complaints, or internal processes. This also includes discussions about workflow automation, task assignments, or structured follow-up mechanisms.")]
    static string EsaleCaseManagement()
    {
        return $"Case Management is available in our Shop or by contacting sales@webropol.fi. Price is 999€ per year. Ad video: https://new.webropolsurveys.com/TrainingVideos/Home#/TrainingVideos/Player/99b46d1d-deee-4550-9f41-32a9a047f6bd";
    }

    [Description("Evaluate if the user is asking about AI Text Analysis, specifically in relation to processing open-ended questions, summarizing large volumes of responses, extracting key insights, or identifying trends in textual data. This applies if the user mentions handling a significant number of responses or analyzing free-text feedback.")]
    static string EsaleAiTextAnalysis(string lastQuery = "")
    {
        if (lastQuery.Contains("large volume", StringComparison.OrdinalIgnoreCase))
        {
            return $"AI text analysis is ideal for summarizing large responses. Available for 300€/year. Contact sales@webropol.fi.";
        }
        return $"AI text analysis is available in our Shop or by contacting sales@webropol.fi. Price: 300€/year.";
    }
    
}