import Link from 'next/link';
import MergePage from './Merge/page';

export default function Home() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-col items-center m-auto'>
        <span className='text-center text-3xl text-orange-600 font-bold'>
          Document Generation
        </span>
        <span className='flex gap-2 justify-center items-center text-sm text-gray-600'>
          <span className='text-xs text-gray-400'>using</span>
          <span className=''>
            <span className='text-[#e63622] font-bold'>Adobe</span> Document
            Generation API
            <span className='text-xs text-amber-600 font-semibold'>SDK</span>
          </span>
        </span>
      </div>
      <div className='mt-4 mx-auto flex items-center gap-2'>
        <Link
          href='https://www.adobe.io/apis/documentcloud/dcsdk/doc-generation.html'
          target='_blank'
          rel='noopener noreferrer'
          passHref>
          <span className='text-blue-600 underline'>Adobe Documentation</span>
        </Link>
        |
        <Link
          href='https://github.com/SanjeevSaniel/adobe-doc-merge'
          target='_blank'
          rel='noopener noreferrer'
          passHref>
          <span className='text-blue-600 underline mt-2'>
            GitHub Repository
          </span>
        </Link>
      </div>
      <MergePage />
    </div>
  );
}
