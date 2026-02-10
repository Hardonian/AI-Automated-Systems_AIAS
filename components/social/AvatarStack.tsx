import Image from 'next/image';

export default function AvatarStack({ urls = [] }: { urls?: string[] }) {
  return (
    <div className='flex -space-x-2'>
      {urls.slice(0, 5).map((u, i) => (
        <Image
          key={i}
          alt={`User avatar ${i + 1}`}
          aria-hidden='true'
          className='inline-block h-8 w-8 rounded-full object-cover ring-2 ring-white'
          src={u}
          width={32}
          height={32}
        />
      ))}
      {urls.length > 5 && (
        <div className='grid h-8 w-8 place-items-center rounded-full bg-muted text-xs ring-2 ring-white'>
          +{urls.length - 5}
        </div>
      )}
    </div>
  );
}
