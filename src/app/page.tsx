import MergePage from './merge/page';

export default function Home() {
  return (
    <div className='flex flex-col gap-4'>
      <p className='w-full text-center text-2xl text-orange-600 font-bold'>
        DOCX Gen Next
      </p>
      <MergePage />
    </div>
  );
}
