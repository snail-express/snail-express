export default function Button(props) {
  let classes = "";
  if (props.className && props.className.includes('light-button')) {
    classes = "fs-4 btn generic-button-light "
  } else if (props.className && props.className.includes('create-button')) {
    classes = "fs-4 btn btn-success "
  } else {
    classes = "fs-4 btn generic-button ";
  }
  if (props.className) {
    classes += props.className;
  }

  return (
      <button {...props} className={classes}>
        {props.children}
      </button>
  );
}