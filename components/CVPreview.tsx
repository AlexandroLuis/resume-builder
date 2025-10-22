import React from 'react';
import type { CVData, LayoutType } from '../types';
import { EmailIcon, PhoneIcon, LocationIcon, LinkedInIcon, GitHubIcon, WebsiteIcon } from './icons';

interface CVPreviewProps {
  cvData: CVData;
  layout: LayoutType;
}

const formatDescription = (text: string) => {
    return text.split('\n').filter(line => line.trim() !== '').map((line, index) => (
      <li key={index} className="text-gray-700 list-disc list-inside">{line}</li>
    ));
};

const Section: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({title, children, className}) => (
    <section className={`mb-6 ${className}`}>
        <h3 className="text-xl font-bold text-primary border-b border-gray-300 pb-1 mb-2">{title}</h3>
        {children}
    </section>
);


const ClassicLayout: React.FC<{ cvData: CVData }> = ({ cvData }) => {
    const { personalInfo, summary, experience, education, skills, courses } = cvData;
    return (
        <div className="p-8 text-dark" style={{ fontFamily: "'Helvetica', 'Arial', sans-serif" }}>
            <header className="flex flex-col sm:flex-row items-center mb-8 border-b-2 border-primary pb-4 gap-6">
                {personalInfo.photo && (
                    <img src={personalInfo.photo} alt={personalInfo.name} className="h-32 w-32 rounded-full object-cover shadow-md flex-shrink-0" />
                )}
                <div className="flex-grow text-center sm:text-left">
                    <h1 className="text-4xl font-bold text-primary tracking-wider">{personalInfo.name}</h1>
                    <h2 className="text-xl font-semibold text-secondary mt-1">{personalInfo.title}</h2>
                    <div className="flex justify-center sm:justify-start items-center flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                        {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center hover:text-primary"><EmailIcon />{personalInfo.email}</a>}
                        {personalInfo.phone && <span className="flex items-center"><PhoneIcon />{personalInfo.phone}</span>}
                        {personalInfo.address && <span className="flex items-center"><LocationIcon />{personalInfo.address}</span>}
                        {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary"><LinkedInIcon />{personalInfo.linkedin}</a>}
                        {personalInfo.github && <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary"><GitHubIcon />{personalInfo.github}</a>}
                        {personalInfo.website && <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary"><WebsiteIcon />{personalInfo.website}</a>}
                    </div>
                </div>
            </header>
            <main>
                {summary && <Section title="Summary"><p className="text-gray-700">{summary}</p></Section>}
                {experience.length > 0 && (
                    <Section title="Work Experience">
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-lg font-semibold">{exp.role}</h4>
                                    <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <h5 className="text-md font-medium text-secondary italic">{exp.company}</h5>
                                <ul className="mt-1 ml-2">{formatDescription(exp.description)}</ul>
                            </div>
                        ))}
                    </Section>
                )}
                {education.length > 0 && (
                    <Section title="Education">
                        {education.map(edu => (
                            <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-lg font-semibold">{edu.institution}</h4>
                                    <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <h5 className="text-md font-medium text-secondary italic">{edu.degree}</h5>
                                {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
                            </div>
                        ))}
                    </Section>
                )}
                {courses.length > 0 && (
                    <Section title="Courses & Certifications">
                        {courses.map(course => (
                            <div key={course.id} className="mb-2">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-lg font-semibold">{course.name}</h4>
                                    <p className="text-sm text-gray-600">{course.date}</p>
                                </div>
                                <h5 className="text-md font-medium text-secondary italic">{course.institution}</h5>
                            </div>
                        ))}
                    </Section>
                )}
                {skills.length > 0 && (
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.map(skill => <span key={skill} className="bg-secondary/20 text-primary text-sm font-medium px-3 py-1 rounded-full">{skill}</span>)}
                        </div>
                    </Section>
                )}
            </main>
        </div>
    );
};

const ModernLayout: React.FC<{ cvData: CVData }> = ({ cvData }) => {
    const { personalInfo, summary, experience, education, skills, courses } = cvData;
    return (
        <div className="flex flex-col md:flex-row min-h-[29.7cm]">
            {/* Left Sidebar */}
            <aside className="w-full md:w-1/3 bg-gray-100 p-8 text-dark">
                {personalInfo.photo && (
                    <img src={personalInfo.photo} alt={personalInfo.name} className="h-40 w-40 rounded-full object-cover shadow-lg mx-auto mb-6" />
                )}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary tracking-wider">{personalInfo.name}</h1>
                    <h2 className="text-lg font-semibold text-secondary mt-1">{personalInfo.title}</h2>
                </div>
                 <div className="space-y-3 text-sm text-gray-600">
                    {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center break-all hover:text-primary"><EmailIcon /><span>{personalInfo.email}</span></a>}
                    {personalInfo.phone && <span className="flex items-center"><PhoneIcon />{personalInfo.phone}</span>}
                    {personalInfo.address && <span className="flex items-center"><LocationIcon />{personalInfo.address}</span>}
                    {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center break-all hover:text-primary"><LinkedInIcon /><span>{personalInfo.linkedin}</span></a>}
                    {personalInfo.github && <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center break-all hover:text-primary"><GitHubIcon /><span>{personalInfo.github}</span></a>}
                    {personalInfo.website && <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center break-all hover:text-primary"><WebsiteIcon /><span>{personalInfo.website}</span></a>}
                </div>

                {summary && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-primary border-b border-gray-300 pb-1 mb-2">Summary</h3>
                        <p className="text-gray-700 text-sm">{summary}</p>
                    </div>
                )}

                {skills.length > 0 && (
                     <div className="mt-8">
                        <h3 className="text-lg font-bold text-primary border-b border-gray-300 pb-1 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {skills.map(skill => <span key={skill} className="bg-secondary/20 text-primary text-xs font-medium px-2 py-1 rounded-full">{skill}</span>)}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="w-full md:w-2/3 p-8">
                 {experience.length > 0 && (
                    <Section title="Work Experience">
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-lg font-semibold">{exp.role}</h4>
                                    <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <h5 className="text-md font-medium text-secondary italic">{exp.company}</h5>
                                <ul className="mt-1 ml-2">{formatDescription(exp.description)}</ul>
                            </div>
                        ))}
                    </Section>
                )}
                {education.length > 0 && (
                    <Section title="Education">
                        {education.map(edu => (
                            <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-lg font-semibold">{edu.institution}</h4>
                                    <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <h5 className="text-md font-medium text-secondary italic">{edu.degree}</h5>
                                {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
                            </div>
                        ))}
                    </Section>
                )}
                {courses.length > 0 && (
                    <Section title="Courses & Certifications">
                        {courses.map(course => (
                            <div key={course.id} className="mb-2">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-lg font-semibold">{course.name}</h4>
                                    <p className="text-sm text-gray-600">{course.date}</p>
                                </div>
                                <h5 className="text-md font-medium text-secondary italic">{course.institution}</h5>
                            </div>
                        ))}
                    </Section>
                )}
            </main>
        </div>
    );
};

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, layout }) => {
  return (
    <div id="cv-preview" className="bg-white rounded-xl overflow-hidden">
      <div id="cv-preview-content" className="text-dark" style={{ fontFamily: "'Helvetica', 'Arial', sans-serif" }}>
        {layout === 'classic' && <ClassicLayout cvData={cvData} />}
        {layout === 'modern' && <ModernLayout cvData={cvData} />}
      </div>
    </div>
  );
};

export default CVPreview;