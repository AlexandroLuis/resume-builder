import React from 'react';
import type { CVData } from '../types';
import { AddIcon, TrashIcon } from './icons';

interface CVFormProps {
  cvData: CVData;
  onPersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSummaryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExperienceChange: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
  onEducationChange: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onCourseChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCourse: () => void;
  onRemoveCourse: (id: string) => void;
  onSkillsChange: (skills: string[]) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md mb-6">
    <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-secondary pb-2">{title}</h2>
    {children}
  </div>
);

const Input: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string }> = 
  ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-600 bg-dark text-light rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary placeholder-gray-400"
    />
  </div>
);

const Textarea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }> = 
  ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-600 bg-dark text-light rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary placeholder-gray-400"
    />
  </div>
);

const SkillsInput: React.FC<{ skills: string[], onSkillsChange: (skills: string[]) => void }> = ({ skills, onSkillsChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !skills.includes(value)) {
        onSkillsChange([...skills, value]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (press Enter or comma to add)</label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-600 bg-dark rounded-md">
        {skills.map(skill => (
          <div key={skill} className="flex items-center bg-secondary text-white text-sm font-medium px-2 py-1 rounded-full">
            <span>{skill}</span>
            <button onClick={() => removeSkill(skill)} className="ml-2 text-white hover:text-red-300">
              &#x2715;
            </button>
          </div>
        ))}
        <input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Add a skill"
          className="flex-grow bg-transparent text-light focus:outline-none placeholder-gray-400"
        />
      </div>
    </div>
  );
};

const CVForm: React.FC<CVFormProps> = ({
  cvData, onPersonalInfoChange, onPhotoChange, onSummaryChange, onExperienceChange, onAddExperience, onRemoveExperience,
  onEducationChange, onAddEducation, onRemoveEducation, onCourseChange, onAddCourse, onRemoveCourse, 
  onSkillsChange
}) => {
  return (
    <div className="space-y-6">
      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="md:col-span-2 mb-4">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="mt-1 flex items-center gap-4">
                    {cvData.personalInfo.photo ? (
                        <img src={cvData.personalInfo.photo} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
                    ) : (
                        <span className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    )}
                    <input type="file" id="photo" name="photo" accept="image/png, image/jpeg" onChange={onPhotoChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-indigo-400"/>
                </div>
            </div>
          <Input label="Full Name" name="name" value={cvData.personalInfo.name} onChange={onPersonalInfoChange} placeholder="e.g. Jane Doe" />
          <Input label="Job Title" name="title" value={cvData.personalInfo.title} onChange={onPersonalInfoChange} placeholder="e.g. Software Engineer" />
          <Input label="Email" name="email" value={cvData.personalInfo.email} onChange={onPersonalInfoChange} placeholder="e.g. jane.doe@example.com" type="email" />
          <Input label="Phone" name="phone" value={cvData.personalInfo.phone} onChange={onPersonalInfoChange} placeholder="e.g. 123-456-7890" />
          <Input label="Address" name="address" value={cvData.personalInfo.address} onChange={onPersonalInfoChange} placeholder="e.g. 123 Main St, Anytown" />
          <Input label="LinkedIn" name="linkedin" value={cvData.personalInfo.linkedin} onChange={onPersonalInfoChange} placeholder="e.g. linkedin.com/in/janedoe" />
          <Input label="GitHub" name="github" value={cvData.personalInfo.github} onChange={onPersonalInfoChange} placeholder="e.g. github.com/janedoe" />
          <Input label="Website/Portfolio" name="website" value={cvData.personalInfo.website || ''} onChange={onPersonalInfoChange} placeholder="e.g. yourportfolio.com" />
        </div>
      </Section>
      
      <Section title="Professional Summary">
         <Textarea label="Summary" name="summary" value={cvData.summary} onChange={onSummaryChange} rows={5} placeholder="Write a brief summary about yourself..."/>
      </Section>

      <Section title="Work Experience">
        {cvData.experience.map(exp => (
          <div key={exp.id} className="p-4 border rounded-lg mb-4 relative">
            <button onClick={() => onRemoveExperience(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Input label="Role" name="role" value={exp.role} onChange={(e) => onExperienceChange(exp.id, e)} />
              <Input label="Company" name="company" value={exp.company} onChange={(e) => onExperienceChange(exp.id, e)} />
              <Input label="Start Date" name="startDate" value={exp.startDate} onChange={(e) => onExperienceChange(exp.id, e)} type="month" />
              <Input label="End Date" name="endDate" value={exp.endDate} onChange={(e) => onExperienceChange(exp.id, e)} type="month" placeholder="or 'Present'"/>
            </div>
            <Textarea label="Description" name="description" value={exp.description} onChange={(e) => onExperienceChange(exp.id, e)} rows={4} placeholder="Describe your responsibilities and achievements..." />
          </div>
        ))}
        <button onClick={onAddExperience} className="flex items-center font-semibold text-primary hover:text-secondary"><AddIcon /> Add Experience</button>
      </Section>

      <Section title="Education">
        {cvData.education.map(edu => (
          <div key={edu.id} className="p-4 border rounded-lg mb-4 relative">
            <button onClick={() => onRemoveEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Institution" name="institution" value={edu.institution} onChange={(e) => onEducationChange(edu.id, e)} />
                <Input label="Degree" name="degree" value={edu.degree} onChange={(e) => onEducationChange(edu.id, e)} />
                <Input label="Start Date" name="startDate" value={edu.startDate} onChange={(e) => onEducationChange(edu.id, e)} type="month" />
                <Input label="End Date" name="endDate" value={edu.endDate} onChange={(e) => onEducationChange(edu.id, e)} type="month" />
            </div>
            <Textarea label="Description" name="description" value={edu.description} onChange={(e) => onEducationChange(edu.id, e)} placeholder="Optional: describe honors, relevant coursework, etc."/>
          </div>
        ))}
        <button onClick={onAddEducation} className="flex items-center font-semibold text-primary hover:text-secondary"><AddIcon /> Add Education</button>
      </Section>

      <Section title="Courses & Certifications">
        {cvData.courses.map(course => (
          <div key={course.id} className="p-4 border rounded-lg mb-4 relative">
            <button onClick={() => onRemoveCourse(course.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Course Name" name="name" value={course.name} onChange={(e) => onCourseChange(course.id, e)} />
                <Input label="Institution" name="institution" value={course.institution} onChange={(e) => onCourseChange(course.id, e)} />
            </div>
            <Input label="Date/Year" name="date" value={course.date} onChange={(e) => onCourseChange(course.id, e)} placeholder="e.g. 2023" />
          </div>
        ))}
        <button onClick={onAddCourse} className="flex items-center font-semibold text-primary hover:text-secondary"><AddIcon /> Add Course</button>
      </Section>
      
      <Section title="Skills">
        <SkillsInput skills={cvData.skills} onSkillsChange={onSkillsChange} />
      </Section>
    </div>
  );
};

export default CVForm;