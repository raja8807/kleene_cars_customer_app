import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({
  children,
  size = 14,
  color = '#333333',
  weight = 'regular',
  style,
  type = 'body',
  ...props
}) => {
  let fontFamily = 'System'; // Default system font
  let fontWeight = '400';

  // Map weight to roughly equivalent values if needed, or just rely on 'fontWeight'
  switch (weight) {
    case 'light': fontWeight = '300'; break;
    case 'regular': fontWeight = '400'; break;
    case 'medium': fontWeight = '500'; break;
    case 'bold': fontWeight = '700'; break;
    case 'heavy': fontWeight = '900'; break;
    default: fontWeight = '400';
  }

  // Predefined types for quick usage
  const typeStyles = {
    heading: { fontSize: 24, fontWeight: '700', color: '#111' },
    subheading: { fontSize: 18, fontWeight: '600', color: '#333' },
    body: { fontSize: 14, fontWeight: '400', color: '#555' },
    caption: { fontSize: 12, fontWeight: '400', color: '#888' },
    label: { fontSize: 14, fontWeight: '500', color: '#333' }
  };

  const selectedTypeStyle = typeStyles[type] || {};

  return (
    <Text
      style={[
        selectedTypeStyle,
        { fontSize: size, color: color, fontWeight: fontWeight },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
