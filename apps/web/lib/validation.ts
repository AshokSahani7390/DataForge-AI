export const validateProjectForm = (data: { name: string; url: string; extractionRules: string }) => {
  const errors: { [key: string]: string } = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Project name must be at least 3 characters.";
  }

  if (!data.url) {
    errors.url = "URL is required.";
  } else {
    try {
      new URL(data.url);
    } catch {
      errors.url = "Please enter a valid URL (e.g., https://example.com).";
    }
  }

  if (!data.extractionRules || data.extractionRules.trim().length < 10) {
    errors.extractionRules = "Please describe what data you want to extract.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
