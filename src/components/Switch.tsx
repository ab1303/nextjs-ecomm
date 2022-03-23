type SwitchProps = {
  isActive: boolean;
  onStateChange: () => void;
};

export default function Switch({ isActive, onStateChange }: SwitchProps) {
  return (
    <label className='flex items-center cursor-pointer'>
      <div className='relative'>
        <input
          type='checkbox'
          className='sr-only'
          checked={isActive}
          onChange={() => onStateChange()}
        />
        <div className='w-10 h-4 bg-gray-400 rounded-full shadow-inner'></div>
        <div className='absolute w-6 h-6 transition bg-white rounded-full shadow dot -left-1 -top-1'></div>
      </div>
    </label>
  );
}
