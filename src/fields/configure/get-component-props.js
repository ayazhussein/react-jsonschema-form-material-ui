import without from 'lodash/without';
import { serializer } from '../components/lib/RichText';
import getMuiProps from './get-mui-props';
import getInputType from './get-input-type';
import valuesToOptions from './values-to-options';

const toNumber = (v) => {
  if (v === '' || v === undefined) return v;
  const n = Number(v);
  return (!Number.isNaN(n) ? n : v);
};

const coerceValue = (type, value) => {
  switch (type) {
    case 'string':
      return (typeof value === 'string' ? value : String(value));
    case 'number':
    case 'integer':
    case 'double':
    case 'float':
    case 'decimal':
      return toNumber(value);
    default:
      return value;
  }
};

const onChangeHandler = (onChange, type, widget, options) => (e) => {
  const value = (type === 'material-date' || type === 'material-time' || type === 'material-datetime') ?
                  e.format() : 
                  (widget === 'material-multiselect' || widget === 'material-select' || widget === 'creatable-select') ?  
                    coerceValue(type, JSON.stringify(e))
                    : (options === 'rich-text-editor') ? serializer.serialize(e) : coerceValue(type, e.target.value);
  if (value !== undefined) onChange(value);
};
const onCheckboxChangeHandler = (onChange, title) => (e) => {
  const spec = {
  };
  if (e) {
    spec.$push = [title];
  }
  else {
    spec.$apply = arr => without(arr, title);
  }
  return onChange(spec);
};

export default ({ schema = {}, uiSchema = {}, inputValue, onChange, onKeyDown, creatableSelectValue, onCreatableSelectChange, onInputChange, htmlId, data, objectData }) => {
  const widget = uiSchema['ui:widget'];
  const options = uiSchema['ui:options'] || {};
  const { type } = schema;
  const rv = {
    type: getInputType(type, uiSchema),
    onChange: onChange && onChangeHandler(onChange, type, widget, options),
    ...getMuiProps(uiSchema),
  };
  if (schema.enum) {
    if (widget === 'radio') {
      if (options.inline) {
        rv.row = true;
      }
    }
    else if (widget === 'checkboxes') {
      rv.onChange = onChange && onCheckboxChangeHandler(onChange, schema.title);
      rv.label = schema.title;
    }
    else {
      rv.nullOption = 'Please select...';
    }
    rv.label = schema.title || '';
    if (widget === 'material-select' || widget === 'material-multiselect') {
      rv.multiSelect = (widget === 'material-multiselect');
    }

    rv.options = valuesToOptions(schema.enum);
  }
  else if (type === 'boolean') {
    rv.label = schema.title;
    rv.onChange = onChange;
  }
  else {
    rv.label = schema.title || '';
    rv.inputProps = {
      id: htmlId,
    };
  }
  if (widget === 'textarea') {
    rv.multiline = true;
    rv.rows = 5;
  }

  if (options.disabled) {
    if (typeof options.disabled === 'boolean') {
      rv.disabled = options.disabled;
    }
    else if (typeof options.disabled === 'function') {
      rv.disabled = (options.disabled).call(null, data, objectData);
    }
  }
  return rv;
};
