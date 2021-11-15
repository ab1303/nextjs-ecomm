type ToastProps = {
  msg: {
    title: string;
    msg: string;
  };
  bgColor: string;
  handleShow: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Toast = ({ msg, handleShow, bgColor }: ToastProps) => {
  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: '5px', right: '5px', zIndex: 9, minWidth: '280px' }}
    >
      <div className={`toast-header ${bgColor} text-light`}>
        <strong className='mr-auto text-light'>{msg.title}</strong>

        <button
          type='button'
          className='ml-2 mb-1 close text-light'
          data-dismiss='toast'
          style={{ outline: 'none' }}
          onClick={handleShow}
        >
          x
        </button>
      </div>

      <div className='toast-body'>{msg.msg}</div>
    </div>
  );
};

export default Toast;
