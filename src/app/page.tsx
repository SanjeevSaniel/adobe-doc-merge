import Header from './header';
import MergePage from './merge/page';

export default function Home() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <Header />
      <div className='flex justify-between items-center w-full'>
        <div className='max-w-[70%] m-auto'>
          <MergePage />
        </div>
      </div>
    </div>
  );
}
