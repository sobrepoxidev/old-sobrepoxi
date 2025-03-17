'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Locale } from 'next-intl';
import { ChangeEvent, ReactNode, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="flex items-end">
      <label
        className={clsx(
          'relative text-gray-800 dark:text-gray-200',
          isPending && 'transition-opacity [&:disabled]:opacity-30'
        )}
      >
        <p className="sr-only">{label}</p>
        <div className="relative">
          {/* Ícono de bandera (ajusta la lógica según el locale actual) */}
          {/* <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
      {currentLocale === 'es' ? (
        <Image src="/flags/es.svg" alt="Español" width={20} height={20} />
      ) : (
        <Image src="/flags/en.svg" alt="English" width={20} height={20} />
      )}
    </span> */}
          <select
            className="inline-flex appearance-none bg-transparent py-3 px-5" // Ajusta el padding-left para dejar espacio al ícono
            defaultValue={defaultValue}
            disabled={isPending}
            onChange={onSelectChange}
          >
            {children}
          </select>
          <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
        </div>
      </label>
    </div>
  );
}
