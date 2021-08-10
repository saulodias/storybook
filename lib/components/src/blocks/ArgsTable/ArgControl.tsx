import React, { FC, useCallback, useState, useEffect } from 'react';
import { Args, ArgType } from './types';
import {
  BooleanControl,
  ColorControl,
  DateControl,
  FilesControl,
  NumberControl,
  ObjectControl,
  OptionsControl,
  RangeControl,
  TextControl,
} from '../../controls';

export interface ArgControlProps {
  row: ArgType;
  arg: any;
  updateArgs: (args: Args) => void;
}

const NoControl = () => <>-</>;

export const ArgControl: FC<ArgControlProps> = ({ row, arg, updateArgs }) => {
  const { key, control } = row;

  const [isFocused, setFocused] = useState(false);
  const [value, setValue] = useState(() => arg);

  useEffect(() => {
    if (!isFocused) setValue(arg);
  }, [isFocused, arg]);

  const onChange = useCallback(
    (argVal: any) => {
      setValue(argVal);
      updateArgs({ [key]: argVal });
      return argVal;
    },
    [updateArgs, key]
  );

  const onBlur = useCallback(() => setFocused(false), []);
  const onFocus = useCallback(() => setFocused(true), []);

  if (!control || control.disable) return <NoControl />;

  // row.name is a display name and not a suitable DOM input id or name - i might contain whitespace etc.
  // row.key is a hash key and therefore a much safer choice
  const props = { name: key, argType: row, value, onChange, onBlur, onFocus };
  switch (control.type) {
    case 'array':
    case 'object':
      return <ObjectControl {...props} {...control} />;
    case 'boolean':
      return <BooleanControl {...props} {...control} />;
    case 'color':
      return <ColorControl {...props} {...control} />;
    case 'date':
      return <DateControl {...props} {...control} />;
    case 'number':
      return <NumberControl {...props} {...control} />;
    case 'check':
    case 'inline-check':
    case 'radio':
    case 'inline-radio':
    case 'select':
    case 'multi-select':
      return <OptionsControl {...props} {...control} controlType={control.type} />;
    case 'range':
      return <RangeControl {...props} {...control} />;
    case 'text':
      return <TextControl {...props} {...control} />;
    case 'file':
      return <FilesControl {...props} {...control} />;
    default:
      return <NoControl />;
  }
};
