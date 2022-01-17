import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Children, cloneElement } from 'react';

type NamedChildrenSlots = {
  media: React.ReactElement;
  action: React.ReactNode;
};

type SideNavLinkProps = {
  href: string;
  name: string;
  className?: string;
  children: React.ReactElement | NamedChildrenSlots;
};

const isObject = <T extends Record<string, unknown>>(value: any): value is T =>
  typeof value === 'object' &&
  typeof value !== 'function' &&
  typeof value !== undefined;

const isNamedSlots = (children: any): children is NamedChildrenSlots =>
  isObject(children) && 'action' in children;

export default function SideNavLink({
  href,
  name,
  className,
  children,
}: SideNavLinkProps) {
  const router = useRouter();

  const childrenWithProps = isNamedSlots(children)
    ? cloneElement(children.media, {
        className: clsx(
          children.media.props.className,
          'w-5 h-5 mx-5',
          router.asPath === href
            ? 'fill-current text-orange-600'
            : 'text-gray-600'
        ),
      })
    : Children.map(children, (child: React.ReactElement) => {
        return cloneElement(child, {
          className: clsx(
            child.props.className,
            'w-5 h-5 mx-5',
            router.asPath === href
              ? 'fill-current text-orange-600'
              : 'text-gray-600'
          ),
        });
      });

  return (
    <li
      className={clsx(
        'flex justify-between items-center h-14 rounded-sm hover:bg-gray-100',
        className
      )}
    >
      <Link href={href}>
        <a className='flex justify-start items-center w-full h-full space-x-3'>
          {childrenWithProps}
          <span
            className={clsx(
              'text-lg font-bold',
              router.asPath === href ? 'text-orange-600' : 'text-gray-600'
            )}
          >
            {name}
          </span>
        </a>
      </Link>
    </li>
  );
}
