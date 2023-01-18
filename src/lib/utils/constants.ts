/**
 * Commands that can't be disabled
 */
export const SAVE_COMMANDS = ['help', 'enablecommand', 'disablecommand'];

/**
 * Categories that can't be disabled
 */
export const SAVE_CATEGORIES = ['dev', 'settings'];

/**
 * Image extensions:
 * - bmp
 * - jpg
 * - jpeg
 * - png
 * - gif
 * - webp
 */
// eslint-disable-next-line prefer-named-capture-group
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;
