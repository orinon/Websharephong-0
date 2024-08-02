'use client';

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  // Props Pattern: Dữ liệu của bài đăng được truyền từ component cha xuống
  // Các props như data, reservation, onAction, disabled, actionLabel, actionId, và currentUser
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
};

// Functional Component Pattern: Component được viết dưới dạng hàm hồi đáp
const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  // Memoization Pattern: Sử dụng hook useMemo để tối ưu hiệu suất tính toán
  // Tránh việc tính toán không cần thiết khi các props thay đổi
  const location = useMemo(() => getByValue(data.locationValue), [data.locationValue]);

  // Event Handling Pattern: Xử lý sự kiện một cách rõ ràng thông qua việc sử dụng callback function
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    }, [disabled, onAction, actionId]);

  // Render Optimization Pattern: Sử dụng React.memo để tối ưu hiệu suất render
  // Đảm bảo rằng component chỉ render lại khi các props thay đổi
  return (
    <div onClick={() => router.push(`/listings/${data.id}`)} className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc}
            alt="Listing"
          />
          <div className="absolute top-3 right-3">
            {/* Props Pattern: Truyền dữ liệu từ component cha xuống component con */}
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {/* Props Pattern: Hiển thị dữ liệu từ props */}
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {/* Props Pattern: Hiển thị dữ liệu từ props */}
          {reservation ? `${format(new Date(reservation.startDate), 'PP')} - ${format(new Date(reservation.endDate), 'PP')}` : data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            {/* Props Pattern: Hiển thị dữ liệu từ props */}
            $ {reservation ? reservation.totalPrice : data.price}
          </div>
          {!reservation && (
            <div className="font-light">đêm</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default ListingCard;
