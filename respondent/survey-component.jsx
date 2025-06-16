import React, { useState, useRef, useEffect } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import * as Separator from '@radix-ui/react-separator';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

// Import survey configuration
import { surveyConfig } from './survey-config';

// Radio Option Component
const RadioOption = ({ value, label }) => (
  <div className="flex items-center space-x-2 py-2">
    <RadioGroup.Item
      id={`radio-${value}`}
      value={value}
      className="w-[16px] h-[16px] rounded-full border border-gray-300 data-[state=checked]:border-blue-600 outline-none cursor-pointer"
    >
      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative">
        <div className="w-[8px] h-[8px] rounded-full bg-blue-600" />
      </RadioGroup.Indicator>
    </RadioGroup.Item>
    <label htmlFor={`radio-${value}`} className="text-gray-800 cursor-pointer">
      {label}
    </label>
  </div>
);

// Checkbox Option Component
const CheckboxOption = ({ id, checked, onChange, label }) => (
  <div className="flex items-center space-x-2 py-2">
    <Checkbox.Root
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="w-[16px] h-[16px] rounded border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 outline-none cursor-pointer"
    >
      <Checkbox.Indicator className="flex items-center justify-center text-white">
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
    <label htmlFor={id} className="text-gray-800 cursor-pointer">
      {label}
    </label>
  </div>
);

// Single Selection Question Component
const SingleSelectionQuestion = ({ section }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <RadioGroup.Root className="space-y-1" defaultValue="" aria-label={section.title}>
        {section.options.map((option, index) => (
          <RadioOption key={`${section.id}-option-${index}`} value={`option${index + 1}`} label={option} />
        ))}
      </RadioGroup.Root>
    </div>
  );
};

// Multiple Selection Question Component
const MultipleSelectionQuestion = ({ section }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleCheckboxChange = (optionId, checked) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, optionId]);
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
    }
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="space-y-1">
        {section.options.map((option, index) => {
          const optionId = `${section.id}-option-${index + 1}`;
          return (
            <CheckboxOption
              key={optionId}
              id={optionId}
              checked={selectedOptions.includes(optionId)}
              onChange={(checked) => handleCheckboxChange(optionId, checked)}
              label={option}
            />
          );
        })}
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        You can select from {section.constraints.min} up to {section.constraints.max} options
      </p>
      <p className="text-sm text-gray-500">
        Selected options: {selectedOptions.length}
      </p>
    </div>
  );
};

// Dropdown Question Component
const DropdownQuestion = ({ section }) => {
  const [value, setValue] = useState("");
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="relative">
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Trigger 
            className="inline-flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            aria-label={section.title}
          >
            <Select.Value placeholder={section.placeholder} />
            <Select.Icon className="text-gray-500">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content 
              className="overflow-hidden bg-white rounded-md shadow-md z-50 border border-gray-200"
              position="popper"
              sideOffset={5}
              align="start"
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              
              <Select.Viewport className="p-1">
                {section.options.map((option, i) => (
                  <Select.Item
                    key={`${section.id}-option-${i}`}
                    value={`option-${i + 1}`}
                    className="relative flex items-center px-6 py-2 rounded text-gray-800 text-sm hover:bg-blue-50 cursor-pointer outline-none focus:bg-blue-100"
                  >
                    <Select.ItemText>{option}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              
              <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
};

// Matrix Single Selection Component
const MatrixSingleQuestion = ({ section }) => {
  const [selections, setSelections] = useState({});
  
  const handleSelectionChange = (row, column) => {
    setSelections({
      ...selections,
      [row]: column
    });
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/4 p-3 text-left"></th>
              {section.columns.map((column, colIndex) => (
                <th key={`col-${colIndex}`} className="p-3 text-center">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-gray-200">
                <td className="p-3 text-left">{row}</td>
                {section.columns.map((column, colIndex) => {
                  const radioId = `${section.id}-row-${rowIndex}-col-${colIndex}`;
                  const radioName = `${section.id}-row-${rowIndex}`;
                  const radioValue = `col-${colIndex}`;
                  
                  return (
                    <td key={radioId} className="p-3 text-center">
                      <RadioGroup.Root
                        name={radioName}
                        value={selections[rowIndex] || ''}
                        onValueChange={(value) => handleSelectionChange(rowIndex, value)}
                        className="flex justify-center"
                      >
                        <RadioGroup.Item
                          id={radioId}
                          value={radioValue}
                          className="w-[16px] h-[16px] rounded-full border border-gray-300 data-[state=checked]:border-blue-600 outline-none cursor-pointer"
                        >
                          <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative">
                            <div className="w-[8px] h-[8px] rounded-full bg-blue-600" />
                          </RadioGroup.Indicator>
                        </RadioGroup.Item>
                        <span className="sr-only">{row} {column}</span>
                      </RadioGroup.Root>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Matrix Multiple Selection Component
const MatrixMultipleQuestion = ({ section }) => {
  const [selections, setSelections] = useState({});
  
  const handleCheckboxChange = (rowIndex, colIndex, checked) => {
    const key = `${rowIndex}-${colIndex}`;
    
    setSelections(prev => ({
      ...prev,
      [key]: checked
    }));
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/4 p-3 text-left"></th>
              {section.columns.map((column, colIndex) => (
                <th key={`col-${colIndex}`} className="p-3 text-center">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-gray-200">
                <td className="p-3 text-left">{row}</td>
                {section.columns.map((column, colIndex) => {
                  const checkboxId = `${section.id}-row-${rowIndex}-col-${colIndex}`;
                  const key = `${rowIndex}-${colIndex}`;
                  const isChecked = selections[key] || false;
                  
                  return (
                    <td key={checkboxId} className="p-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox.Root
                          id={checkboxId}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleCheckboxChange(rowIndex, colIndex, checked)}
                          className="w-[16px] h-[16px] rounded border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 outline-none cursor-pointer"
                        >
                          <Checkbox.Indicator className="flex items-center justify-center text-white">
                            <CheckIcon />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                        <span className="sr-only">{row} {column}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Navigation Header Component
const SurveyHeader = ({ currentPage, setCurrentPage, totalPages }) => (
  <header className="bg-white border-b border-gray-200 py-2 fixed top-0 w-full z-10">
    <div className="container mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-blue-600">Preview & Test</button>
        
        <div className="flex border border-gray-300 rounded">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 border-r border-gray-300 flex items-center">
            Desktop
          </button>
          <button className="px-3 py-1 text-gray-700 border-r border-gray-300 flex items-center">
            Tablet
          </button>
          <button className="px-3 py-1 text-gray-700 flex items-center">
            Mobile
          </button>
        </div>
        
        <div className="flex border border-gray-300 rounded">
          <button className="px-2 py-1">Page</button>
          <span className="px-2 py-1 border-x border-gray-300">{currentPage}</span>
          <button className="px-2 py-1 text-gray-700">↓</button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-blue-600">Export survey</button>
        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">PHP</button>
        <button className="border border-gray-300 bg-white px-3 py-1 rounded hover:bg-gray-100">Word</button>
      </div>
    </div>
  </header>
);

// Open-ended Text Component
const OpenTextQuestion = ({ section }) => {
  const [value, setValue] = useState("");
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <textarea 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={section.placeholder}
        rows={section.rows || 4}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
    </div>
  );
};

// Scale Question Component (CES)
const ScaleQuestion = ({ section }) => {
  const [value, setValue] = useState("");
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">{section.minLabel}</span>
          <span className="text-sm text-gray-700">{section.maxLabel}</span>
        </div>
        
        <RadioGroup.Root 
          className="flex justify-between items-center" 
          value={value} 
          onValueChange={setValue}
        >
          {Array.from({ length: section.max - section.min + 1 }, (_, i) => i + section.min).map((num) => (
            <div key={`scale-${num}`} className="text-center flex-1">
              <div className="flex justify-center mb-1">
                <RadioGroup.Item
                  id={`scale-${section.id}-${num}`}
                  value={num.toString()}
                  className="w-[16px] h-[16px] rounded-full border border-gray-300 data-[state=checked]:border-blue-600 outline-none cursor-pointer"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative">
                    <div className="w-[8px] h-[8px] rounded-full bg-blue-600" />
                  </RadioGroup.Indicator>
                </RadioGroup.Item>
              </div>
              {section.showNumbers && (
                <label htmlFor={`scale-${section.id}-${num}`} className="text-xs text-gray-600 cursor-pointer">
                  {num}
                </label>
              )}
            </div>
          ))}
        </RadioGroup.Root>
      </div>
    </div>
  );
};

// Slider Component
const SliderQuestion = ({ section }) => {
  const [value, setValue] = useState([section.defaultValue || section.min]);
  const sliderTrackRef = useRef(null);
  const [handlePosition, setHandlePosition] = useState(0);
  
  // Update handle position when value changes
  useEffect(() => {
    if (sliderTrackRef.current) {
      const percent = ((value[0] - section.min) / (section.max - section.min)) * 100;
      setHandlePosition(percent);
    }
  }, [value, section.min, section.max]);
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="w-full">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">{section.minLabel}</span>
          <span className="text-sm text-gray-700">{section.maxLabel}</span>
        </div>
        
        <div className="relative pt-6">
          <Slider.Root 
            className="relative flex items-center select-none w-full h-5" 
            defaultValue={[section.defaultValue || section.min]}
            min={section.min}
            max={section.max}
            step={1}
            value={value}
            onValueChange={setValue}
          >
            <Slider.Track 
              ref={sliderTrackRef}
              className="bg-gray-200 relative flex-grow rounded-full h-2"
            >
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            
            <Slider.Thumb className="block w-6 h-6 bg-blue-500 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <div className="absolute top-[-24px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs rounded px-1 py-0.5">
                {value[0]}
              </div>
            </Slider.Thumb>
          </Slider.Root>
          
          {section.showNumbers && (
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>{section.min}</span>
              <span>{section.max}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Smiley Scale Component
const SmileyQuestion = ({ section }) => {
  const [value, setValue] = useState("");
  
  // Define smiley configurations based on the value
  const smileys = [
    { value: '1', color: 'bg-red-500', label: 'Very Dissatisfied' },
    { value: '2', color: 'bg-orange-500', label: 'Dissatisfied' },
    { value: '3', color: 'bg-yellow-500', label: 'Neutral' },
    { value: '4', color: 'bg-green-500', label: 'Satisfied' },
    { value: '5', color: 'bg-green-600', label: 'Very Satisfied' }
  ];
  
  const getSmileyPath = (index) => {
    // Return appropriate SVG path based on the smiley index
    switch(index) {
      case 0: // Very sad
        return "M9 15C9 15 10 13 12 13C14 13 15 15 15 15M9 10H9.01M15 10H15.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z";
      case 1: // Slightly sad
        return "M9.5 15.5C9.5 15.5 10.5 14.5 12 14.5C13.5 14.5 14.5 15.5 14.5 15.5M9 10H9.01M15 10H15.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z";
      case 2: // Neutral
        return "M9 15H15M9 10H9.01M15 10H15.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z";
      case 3: // Happy
        return "M15 9H15.01M9 9H9.01M16 13C16 13 15 15 12 15C9 15 8 13 8 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z";
      case 4: // Very happy
        return "M15 9H15.01M9 9H9.01M16 14C16 14 15 16 12 16C9 16 8 14 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z";
      default:
        return "M9 15H15M9 10H9.01M15 10H15.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z";
    }
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      
      <div className="w-full">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">{section.minLabel}</span>
          <span className="text-sm text-gray-700">{section.maxLabel}</span>
        </div>
        
        <RadioGroup.Root 
          className="flex justify-between" 
          value={value} 
          onValueChange={setValue}
        >
          {smileys.map((smiley, index) => (
            <RadioGroup.Item
              key={`smiley-${smiley.value}`}
              id={`smiley-${section.id}-${smiley.value}`}
              value={smiley.value}
              className="sr-only"
              aria-label={smiley.label}
            >
              <div className={`w-12 h-12 rounded-full ${smiley.color} flex items-center justify-center hover:scale-110 transition-transform ${value === smiley.value ? 'ring-4 ring-blue-400' : ''}`}>
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d={getSmileyPath(index)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
    </div>
  );
};

// Page Component
const SurveyPage = ({ page, onNextPage, onPrevPage, isFirstPage, isLastPage }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {page.title && <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">{page.title}</h1>}
      
      {page.sections.map((section) => (
        <React.Fragment key={section.id}>
          {section.type === 'single' && <SingleSelectionQuestion section={section} />}
          {section.type === 'multiple' && <MultipleSelectionQuestion section={section} />}
          {section.type === 'dropdown' && <DropdownQuestion section={section} />}
          {section.type === 'matrixSingle' && <MatrixSingleQuestion section={section} />}
          {section.type === 'matrixMultiple' && <MatrixMultipleQuestion section={section} />}
          {section.type === 'openText' && <OpenTextQuestion section={section} />}
          {section.type === 'scale' && <ScaleQuestion section={section} />}
          {section.type === 'slider' && <SliderQuestion section={section} />}
          {section.type === 'smiley' && <SmileyQuestion section={section} />}
        </React.Fragment>
      ))}
      
      <div className={`flex ${isFirstPage ? 'justify-end' : 'justify-between'} mt-8`}>
        {!isFirstPage && (
          <button 
            onClick={onPrevPage}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {surveyConfig.navigation.previousButtonText}
          </button>
        )}
        <button 
          onClick={onNextPage}
          className={`bg-white ${isLastPage ? 'border-orange-400 text-orange-700 hover:bg-orange-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-4 py-2 rounded focus:outline-none focus:ring-2 ${isLastPage ? 'focus:ring-orange-500' : 'focus:ring-blue-500'} focus:ring-opacity-50`}
        >
          {isLastPage ? surveyConfig.navigation.submitButtonText : surveyConfig.navigation.nextButtonText}
        </button>
      </div>
    </div>
  );
};

// Main Survey Component
export const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  
  const totalPages = surveyConfig.pages.length;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSubmit = () => {
    console.log('Form data submitted:', formData);
    // Here you would typically send the data to an API
    alert('Survey completed! Thank you for your responses.');
  };
  
  const currentPageData = surveyConfig.pages.find(page => page.pageNumber === currentPage);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <SurveyHeader 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      
      <main className="container mx-auto px-4 py-8 mt-14 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">{surveyConfig.title}</h1>
        
        <Form.Root onSubmit={(e) => e.preventDefault()}>
          {currentPageData && (
            <SurveyPage 
              page={currentPageData}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
            />
          )}
        </Form.Root>
      </main>
    </div>
  );
};

export default Survey;
