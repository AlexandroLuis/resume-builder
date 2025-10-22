import React, { useState, useCallback } from 'react';
import { CVData, Experience, Education, Course, LayoutType } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import { improveWithAI } from './services/geminiService';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

// FIX: Removed React.FC type annotation to fix component type error and improve type inference.
const App = () => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      linkedin: 'linkedin.com/in/janedoe',
      github: 'github.com/janedoe',
      website: 'yourportfolio.com',
      title: 'Senior Software Engineer',
      photo: '',
    },
    summary: 'A highly motivated and experienced software engineer with a passion for creating efficient and scalable web applications. Proficient in various programming languages and frameworks.',
    experience: [
      {
        id: `exp-${Date.now()}`,
        company: 'Tech Solutions Inc.',
        role: 'Software Engineer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Developed and maintained web applications using React and Node.js.\nCollaborated with cross-functional teams to deliver high-quality software products.\nImplemented new features and optimized existing code for performance.'
      }
    ],
    education: [
      {
        id: `edu-${Date.now()}`,
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development.'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Docker', 'AWS'],
    courses: [
      {
        id: `course-${Date.now()}`,
        name: 'Advanced React Patterns',
        institution: 'Online Platform',
        date: '2023'
      }
    ]
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});
  const [layout, setLayout] = useState<LayoutType>('classic');

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, photo: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvData(prev => ({ ...prev, summary: e.target.value }));
  };

  const handleExperienceChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [name]: value } : exp)
    }));
  };
  
  const addExperience = () => {
    const newExp: Experience = { id: `exp-${Date.now()}`, company: '', role: '', startDate: '', endDate: '', description: '' };
    setCvData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const handleEducationChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [name]: value } : edu)
    }));
  };

  const addEducation = () => {
    const newEdu: Education = { id: `edu-${Date.now()}`, institution: '', degree: '', startDate: '', endDate: '', description: '' };
    setCvData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const handleCourseChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      courses: prev.courses.map(course => course.id === id ? { ...course, [name]: value } : course)
    }));
  };

  const addCourse = () => {
    const newCourse: Course = { id: `course-${Date.now()}`, name: '', institution: '', date: '' };
    setCvData(prev => ({ ...prev, courses: [...prev.courses, newCourse] }));
  };

  const removeCourse = (id: string) => {
    setCvData(prev => ({ ...prev, courses: prev.courses.filter(course => course.id !== id) }));
  };
  
  const handleSkillsChange = (skills: string[]) => {
    setCvData(prev => ({ ...prev, skills }));
  };

  const handleImprove = useCallback(async (field: string, id: string | null, originalText: string) => {
    const loadingKey = id ? `${field}-${id}` : field;
    setLoadingAI(prev => ({...prev, [loadingKey]: true}));
    try {
      const improvedText = await improveWithAI(originalText, field);
      if (field === 'summary') {
        setCvData(prev => ({ ...prev, summary: improvedText }));
      } else if (field === 'experience' && id) {
        setCvData(prev => ({
          ...prev,
          experience: prev.experience.map(exp => exp.id === id ? { ...exp, description: improvedText } : exp)
        }));
      }
// FIX: Added explicit 'any' type to error to fix "Cannot find name 'error'" and updated alert message to not mention API key.
    } catch (error: any) {
      console.error("AI improvement failed:", error);
      alert("Failed to get AI suggestion. Please try again.");
    } finally {
      setLoadingAI(prev => ({...prev, [loadingKey]: false}));
    }
  }, []);

  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const cvElement = document.getElementById('cv-preview-content');
    if (cvElement) {
      const originalWidth = cvElement.style.width;
      cvElement.style.width = '1056px';

      window.html2canvas(cvElement, { 
        scale: 2,
        useCORS: true, 
        windowWidth: 1200,
        logging: false,
      }).then((canvas: any) => {
         cvElement.style.width = originalWidth;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${cvData.personalInfo.name.replace(' ', '_')}_CV.pdf`);
      }).catch((err: any) => {
          console.error("PDF generation failed:", err);
          cvElement.style.width = originalWidth;
      });
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Free Resume Builder</h1>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="flex items-center bg-secondary/80 rounded-lg p-1">
                <button onClick={() => setLayout('classic')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${layout === 'classic' ? 'bg-accent text-white shadow' : 'text-white/80 hover:bg-white/20'}`}>Classic</button>
                <button onClick={() => setLayout('modern')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${layout === 'modern' ? 'bg-accent text-white shadow' : 'text-white/80 hover:bg-white/20'}`}>Modern</button>
            </div>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="bg-accent hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Preview
            </button>
            <a
              href="https://donate.alexandrorocha.me"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Sponsor
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <CVForm 
          cvData={cvData}
          onPersonalInfoChange={handlePersonalInfoChange}
          onPhotoChange={handlePhotoChange}
          onSummaryChange={handleSummaryChange}
          onExperienceChange={handleExperienceChange}
          onAddExperience={addExperience}
          onRemoveExperience={removeExperience}
          onEducationChange={handleEducationChange}
          onAddEducation={addEducation}
          onRemoveEducation={removeEducation}
          onCourseChange={handleCourseChange}
          onAddCourse={addCourse}
          onRemoveCourse={removeCourse}
          onSkillsChange={handleSkillsChange}
          onImprove={handleImprove}
          loadingAI={loadingAI}
        />
      </main>
      
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto" onClick={() => setIsPreviewOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 relative" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
              <h3 className="text-xl font-bold text-primary">CV Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="bg-accent hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </button>
                <button 
                  onClick={() => setIsPreviewOpen(false)} 
                  className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
                  aria-label="Close preview"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              <CVPreview cvData={cvData} layout={layout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;