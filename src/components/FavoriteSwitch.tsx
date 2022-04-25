type FavoriteSwitchProps = {
  isSelected: boolean;
  onStateChange: () => void;
};

export default function FavoriteSwitch({
  isSelected,
  onStateChange,
}: FavoriteSwitchProps) {
  return (
    <button className='cursor-pointer' onClick={() => onStateChange()}>
      {isSelected ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-8 w-8 text-orange-600'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
            clipRule='evenodd'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-8 w-8'
          viewBox='0 0 512 512'
          stroke='currentColor'
        >
          <path d='M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z'></path>
        </svg>
      )}
    </button>
  );
}
