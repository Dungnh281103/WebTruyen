/**
 * Data service to fetch and manage data from the JSON file
 */

// Base URL for data files
const DATA_BASE_URL = '/data';

/**
 * Fetch all stories data from JSON file
 * @returns {Promise<Array>} Promise that resolves to array of stories
 */
export const fetchStories = async () => {
  try {
    const response = await fetch(`${DATA_BASE_URL}/stories.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories data');
    }
    const data = await response.json();
    return data.storys || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

/**
 * Fetch a single story by ID
 * @param {string} storyId - ID of the story to fetch
 * @returns {Promise<Object|null>} Promise that resolves to story object or null
 */
export const fetchStoryById = async (storyId) => {
  try {
    const stories = await fetchStories();
    return stories.find(story => story.id === storyId) || null;
  } catch (error) {
    console.error(`Error fetching story with ID ${storyId}:`, error);
    return null;
  }
};

/**
 * Fetch chapters for a specific story
 * @param {string} storyId - ID of the story
 * @returns {Promise<Array>} Promise that resolves to array of chapters
 */
export const fetchChaptersByStoryId = async (storyId) => {
  try {
    const response = await fetch(`${DATA_BASE_URL}/stories.json`);
    const data = await response.json();
    return data.chapters.filter(chapter => chapter.story_id === storyId) || [];
  } catch (error) {
    console.error(`Error fetching chapters for story ID ${storyId}:`, error);
    return [];
  }
};

/**
 * Fetch all categories
 * @returns {Promise<Array>} Promise that resolves to array of categories
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${DATA_BASE_URL}/stories.json`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetch all tags
 * @returns {Promise<Array>} Promise that resolves to array of tags
 */
export const fetchTags = async () => {
  try {
    const response = await fetch(`${DATA_BASE_URL}/stories.json`);
    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

/**
 * Fetch featured stories
 * @returns {Promise<Object>} Promise that resolves to featured stories object
 */
export const fetchFeaturedStories = async () => {
  try {
    const response = await fetch(`${DATA_BASE_URL}/stories.json`);
    const data = await response.json();
    
    // Get all stories first
    const allStories = data.storys || [];
    
    // Map featured IDs to actual story objects
    const featuredData = data.featured || {};
    const result = {};
    
    // Process each featured category
    Object.keys(featuredData).forEach(category => {
      result[category] = featuredData[category]
        .map(id => allStories.find(story => story.id === id))
        .filter(Boolean); // Filter out any null/undefined entries
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    return {};
  }
};


/**
 * Authentication utility functions
 */

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
    return localStorage.getItem('userToken') !== null;
  };
  
  /**
   * Get current user data
   * @returns {Object|null} User data or null if not logged in
   */
  export const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };
  
  /**
   * Fetch user data from user.json based on token
   * @returns {Promise<Object|null>} User data or null
   */
  export const fetchUserData = async () => {
    if (!isLoggedIn()) return null;
    
    try {
      const userId = localStorage.getItem('userId');
      
      // Fetch users.json
      const response = await fetch('/data/users.json');
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      const user = data.users.find(u => u.id === userId);
      
      if (!user) {
        // Invalid user ID in token
        logout();
        return null;
      }
      
      // Remove sensitive data
      const { password, ...safeUserData } = user;
      
      // Update localStorage with latest data
      localStorage.setItem('userData', JSON.stringify(safeUserData));
      
      return safeUserData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  
  /**
   * Logout user
   */
  export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  };