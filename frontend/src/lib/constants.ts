// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const API_TIMEOUT = 30000; // 30 seconds

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "ypf_auth_token",
  CURRENT_USER: "ypf_current_user",
  FARMER_DATA: "ypf_farmer_data",
  THEME: "ypf_theme",
  LANGUAGE: "ypf_language",
};

// User Roles
export const USER_ROLES = {
  FARMER: "farmer",
  EXTENSION_OFFICER: "extension_officer",
  ADMIN: "admin",
};

// Crop Types
export const CROP_TYPES = [
  "Maize",
  "Wheat",
  "Rice",
  "Beans",
  "Sorghum",
  "Millet",
  "Cassava",
  "Potatoes",
  "Vegetables",
  "Fruits",
];

// Soil Types
export const SOIL_TYPES = [
  "Sandy",
  "Loamy",
  "Clay",
  "Silty",
  "Peaty",
  "Chalky",
];

// Irrigation Types
export const IRRIGATION_TYPES = [
  "Rain-fed",
  "Drip Irrigation",
  "Sprinkler",
  "Flood",
  "Mixed",
];

// Yield Status
export const YIELD_STATUS = {
  PLANTED: "planted",
  GROWING: "growing",
  HARVESTED: "harvested",
  COMPLETED: "completed",
};

// Quality Grades
export const QUALITY_GRADES = ["A", "B", "C", "D"];

// Priority Levels
export const PRIORITY_LEVELS = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

// Recommendation Types
export const RECOMMENDATION_TYPES = {
  WATERING: "watering",
  FERTILIZER: "fertilizer",
  PEST_CONTROL: "pest-control",
  HARVESTING: "harvesting",
  PLANTING: "planting",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Colors (Tailwind)
export const COLORS = {
  PRIMARY: "green",
  SECONDARY: "gray",
  SUCCESS: "green",
  WARNING: "yellow",
  ERROR: "red",
  INFO: "blue",
};

// Mock Statistics
export const STATISTICS = {
  ACTIVE_FARMERS: 5000,
  HECTARES_MONITORED: 15000,
  AVERAGE_YIELD_INCREASE: 25,
  SATISFACTION_RATE: 98,
};
