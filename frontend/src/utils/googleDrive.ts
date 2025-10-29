/**
 * Converts a Google Drive view link to a direct download link
 * @param viewUrl - The Google Drive view URL (e.g., https://drive.google.com/file/d/FILE_ID/view)
 * @returns The direct download URL
 */
export function convertToDirectDownloadLink(viewUrl: string): string {
  try {
    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const match1 = viewUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match1) {
      fileId = match1[1];
    }
    
    // Format 2: https://drive.google.com/open?id=FILE_ID
    const match2 = viewUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match2) {
      fileId = match2[1];
    }
    
    // Format 3: https://docs.google.com/document/d/FILE_ID/
    const match3 = viewUrl.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (match3) {
      fileId = match3[1];
    }
    
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    // If no file ID found, return original URL
    return viewUrl;
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
    return viewUrl;
  }
}

/**
 * Validates if a URL is a valid Google Drive link
 * @param url - The URL to validate
 * @returns True if it's a valid Google Drive URL
 */
export function isValidGoogleDriveUrl(url: string): boolean {
  try {
    const drivePatterns = [
      /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9-_]+/,
      /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9-_]+/,
      /^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/[a-zA-Z0-9-_]+/
    ];
    
    return drivePatterns.some(pattern => pattern.test(url));
  } catch (error) {
    return false;
  }
}

/**
 * Extracts file ID from Google Drive URL
 * @param url - The Google Drive URL
 * @returns The file ID or null if not found
 */
export function extractFileId(url: string): string | null {
  try {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /[?&]id=([a-zA-Z0-9-_]+)/,
      /\/document\/d\/([a-zA-Z0-9-_]+)/,
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /\/presentation\/d\/([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}