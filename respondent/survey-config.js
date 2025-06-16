export const surveyConfig = {
  title: "Long survey",
  pages: [
    {
      pageNumber: 1,
      sections: [
        {
          id: "selection1",
          title: "1. Selection",
          type: "single",
          options: ["Option1", "Option2", "Option3", "Option4", "Option5"]
        },
        {
          id: "multiselection1",
          title: "2. Multiselection",
          type: "multiple",
          options: ["Option1", "Option2", "Option3", "Option4", "Option5"],
          constraints: {
            min: 1,
            max: 5
          }
        },
        {
          id: "selection2",
          title: "3. Selection 2",
          type: "single",
          options: ["Option1", "Option2", "Option3", "Option4", "Option5"]
        },
        {
          id: "multiselection2",
          title: "4. Multiselection 2",
          type: "multiple",
          options: ["Option", "Option", "Option"],
          constraints: {
            min: 1,
            max: 2
          }
        },
        {
          id: "selection3",
          title: "5. Selection 3",
          type: "single",
          options: ["Option1", "Option2", "Option3", "Option4", "Option5"]
        }
      ]
    },
    {
      pageNumber: 2,
      sections: [
        {
          id: "dropdown1",
          title: "6. Drop down list",
          type: "dropdown",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          placeholder: "Select"
        },
        {
          id: "matrixSingle",
          title: "7. Matrix selection",
          type: "matrixSingle",
          rows: ["Option1", "Option2", "Option3", "Option4"],
          columns: ["Column1", "Column2", "Column3"]
        },
        {
          id: "matrixMultiple",
          title: "8. Matrix multiselection",
          type: "matrixMultiple",
          rows: ["Option1", "Option2", "Option3", "Option4"],
          columns: ["Column1", "Column2", "Column3"]
        }
      ]
    },
    {
      pageNumber: 3,
      title: "Questions",
      sections: [
        {
          id: "openEnded",
          title: "1. Open ended",
          type: "openText",
          placeholder: "Enter your response here",
          rows: 4
        },
        {
          id: "ces",
          title: "2. CES",
          type: "scale",
          min: 1,
          max: 5,
          minLabel: "Very Difficult",
          maxLabel: "Very Easy",
          showNumbers: true
        },
        {
          id: "cesSlider",
          title: "3. CES Slider",
          type: "slider",
          min: 1,
          max: 5,
          minLabel: "Very Difficult",
          maxLabel: "Very Easy",
          showNumbers: true,
          defaultValue: 1
        },
        {
          id: "cesSmileys",
          title: "4. CES Smileys",
          type: "smiley",
          count: 5,
          minLabel: "Very Difficult",
          maxLabel: "Very Easy"
        }
      ]
    }
  ],
  navigation: {
    nextButtonText: "Next",
    previousButtonText: "Previous",
    submitButtonText: "Submit"
  },
  validation: {
    required: true,
    showValidationMessages: true
  }
};
