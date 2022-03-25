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
      <div className='flex-1 w-2/5'>{leftPane}</div>
      {showRightPane && <div className='w-3/5'>{rightPane}</div>}
    </div>
  );
}
