import clsx from 'clsx';

export default function SplitPanes({
  showRightPane,
  children,
}: {
  showRightPane: boolean;
  children: { rightPane: React.ReactNode; leftPane: React.ReactNode };
}) {
  const { leftPane, rightPane } = children;
  return (
    <div className='flex flex-row'>
      <div className='flex-1'>{leftPane}</div>
      {showRightPane && (
        <div className={clsx('flex-1')}>
          <div className=''>{rightPane}</div>
        </div>
      )}
    </div>
  );
}
