import { Map as ImmutableMap, fromJS } from 'immutable';
import tintify from 'soapbox/utils/colors';
import { generateAccent } from 'soapbox/utils/theme';
/** Check if the value is a valid hex color */
const isHex = value => /^#([0-9A-F]{3}){1,2}$/i.test(value);

/** Expand hex colors into tints */
export const expandPalette = palette => {
  // Generate palette only for present colors
  return Object.entries(palette).reduce((result, colorData) => {
    const [colorName, color] = colorData;

    // Conditionally handle hex color and Tailwind color object
    if (typeof color === 'string' && isHex(color)) {
      result[colorName] = tintify(color);
    } else if (color && typeof color === 'object') {
      result[colorName] = color;
    }
    return result;
  }, {});
};

// Generate accent color only if brandColor is present
const maybeGenerateAccentColor = brandColor => {
  return isHex(brandColor) ? generateAccent(brandColor) : null;
};

/** Build a color object from legacy colors */
export const fromLegacyColors = soapboxConfig => {
  const brandColor = soapboxConfig.get('brandColor');
  const accentColor = soapboxConfig.get('accentColor');
  return expandPalette({
    primary: isHex(brandColor) ? brandColor : null,
    accent: isHex(accentColor) ? accentColor : maybeGenerateAccentColor(brandColor)
  });
};

/** Convert Soapbox Config into Tailwind colors */
export const toTailwind = soapboxConfig => {
  const colors = ImmutableMap(soapboxConfig.get('colors'));
  const legacyColors = ImmutableMap(fromJS(fromLegacyColors(soapboxConfig)));
  return soapboxConfig.set('colors', legacyColors.mergeDeep(colors));
};