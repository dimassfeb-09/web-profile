function TextFieldContact(props) {
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="block">
        {props.children} <span className="text-red-700">*</span>
      </label>
      <input
        onChange={props.onChange}
        type={props.type}
        name={props.name}
        value={props.value}
        className="border w-full rounded-md h-10 p-2"
        placeholder={props.placeholder}
        required={true}
      />
    </div>
  );
}

export default TextFieldContact;
