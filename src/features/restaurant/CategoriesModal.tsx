import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import Modal from '@/components/modal';

import { CategoryListDTO } from '@/pages/api/categories';
import { putData } from '@/utils/fetchHttpClient';

import { Notify } from '@/types';

type CategoriesModalProps = {
  selectedRestaurantId: string | null;
  restaurantCategories: Array<CategoryListDTO>;
  onClose: (updatedRestaurantCategories: Array<CategoryListDTO>) => void;
};

export default function CategoriesModal({
  selectedRestaurantId,
  restaurantCategories,
  onClose,
}: CategoriesModalProps) {
  const { publicRuntimeConfig } = getConfig();

  const [linkedCategories, setLinkedCategories] =
    useState<Array<CategoryListDTO>>(restaurantCategories);

  useEffect(() => {
    setLinkedCategories(restaurantCategories);
  }, [restaurantCategories, selectedRestaurantId]);

  const handleUnLinkCategory = async (id: string) => {
    if (!id) return;

    const categoryToUnLink = restaurantCategories.find((c) => c._id === id);

    if (!categoryToUnLink || !selectedRestaurantId) return;

    const result: { ok: boolean } & Notify = await putData(
      `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/api/restaurant/${selectedRestaurantId}/categories`,
      {
        categoryId: id,
      }
    );

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(result.success || 'Category unlinked!');

    const newLinkedCategories = linkedCategories.filter((c) => c._id !== id);

    setLinkedCategories(newLinkedCategories);
  };

  return (
    <Modal show={linkedCategories?.length > 0}>
      <Modal.Header onClose={() => onClose(linkedCategories)}>
        <Card.Header.Title>Categories</Card.Header.Title>
      </Modal.Header>
      <Modal.Body>
        {linkedCategories.map((category) => (
          <div key={category._id} className='flex flex-row'>
            <div className='mt-4 w-2 bg-orange-300'></div>
            <div className='bg-white flex flex-row flex-1 align-middle shadow mt-4 py-4 px-6 sm:px-10'>
              <span className='flex-1'>{category.name}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6 cursor-pointer'
                viewBox='0 0 24 24'
                fill='currentColor'
                onClick={() => {
                  handleUnLinkCategory(category._id);
                  return;
                }}
              >
                <path
                  fillRule='evenodd'
                  d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
