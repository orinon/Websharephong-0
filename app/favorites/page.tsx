
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getFavoriteListings from "@/app/actions/getFavoriteListings";

import FavoritesClient from "./FavoritesClient";

const ListingPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    // Xử lý trường hợp currentUser là null ở đây, ví dụ: redirect đến trang đăng nhập
    return null;
  }
  //const listings = await getFavoriteListings(currentUser.id); // Truyền userId vào hàm này
  const listingsResult = await getFavoriteListings(currentUser.id); // Truyền userId vào hàm này
  const listings = listingsResult.map((listingResult) => ({
    // Chuyển đổi từ GetResult sang SafeListing
    id: listingResult.id,
    title: listingResult.title,
    description: listingResult.description,
    imageSrc: listingResult.imageSrc,
    createdAt: listingResult.createdAt.toISOString(), // Chuyển đổi Date sang string
    category: listingResult.category,
    roomCount: listingResult.roomCount,
    bathroomCount: listingResult.bathroomCount,
    guestCount: listingResult.guestCount,
    locationValue: listingResult.locationValue,
    userId: listingResult.userId,
    price: listingResult.price
  }));
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Không có nơi yêu thích nào được tìm thấy"
          subtitle="Có vẻ như bạn không có nơi nào được thêm vào danh sách yêu thích."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
 
export default ListingPage;
