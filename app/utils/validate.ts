/**
 * Validates a key with an appended checksum
 * @param {string} keyWithChecksum - The full key string including the checksum
 * @returns {boolean} - True if the checksum is valid, false otherwise
 */
export function validateKeyChecksum(keyWithChecksum: string): boolean {
  // Check if the key has at least enough characters for the key + checksum
  if (!keyWithChecksum || keyWithChecksum.length <= 8) {
    return false;
  }
  
  // Separate the key part from the checksum part
  // The checksum is the last 8 characters
  const keyPart = keyWithChecksum.slice(0, -8);
  const providedChecksum = keyWithChecksum.slice(-8);
  
  // Recalculate the checksum for the key part
  const calculatedChecksum = calculateSimpleChecksum(keyPart);
  
  // Compare the provided checksum with the calculated one
  return providedChecksum === calculatedChecksum;
}

function calculateSimpleChecksum(str: string) {
  // Simple FNV-like hash for demonstration
  let hash = 0x811c9dc5; // FNV offset basis
  
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  
  // Convert to 8-character hex string
  return (hash >>> 0).toString(16).padStart(8, '0');
}