import React from 'react';
import type { TextInput as TextInputRef, TextInputProps } from 'react-native';
// Deep path (same as v1 polyfill). Must NOT import the host component via the
// `react-native` barrel: Metro NATIVE_ALIASES rewrites
// `./Libraries/Components/TextInput/TextInput` (the relative request RN's index
// makes) back to this file, so a barrel import freezes Expo Go / OOMs Hermes the
// first time any screen mounts TextInput. Package subpath resolves the real
// host and is exempt from that relative-key alias. Type-only imports from
// `react-native` are erased and are safe.
// Deep module types are not JSX-friendly under Expo's types; the runtime value
// is the host component (cast mirrors "use host + TextInputProps from RN").
import DeepRNTextInput from 'react-native/Libraries/Components/TextInput/TextInput';

const RNTextInput = DeepRNTextInput as unknown as React.ComponentType<
  TextInputProps & React.RefAttributes<TextInputRef>
>;

const TextInput = React.forwardRef<TextInputRef, TextInputProps>((props, ref) => {
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor={props.placeholderTextColor || 'black'}
      {...props}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
