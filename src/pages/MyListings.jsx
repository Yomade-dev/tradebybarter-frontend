import ListingsScreen from '../components/ListingsScreen';

export default function MyListings() {
  return (
    <ListingsScreen
      title="My listings"
      endpoint="/api/listings/mine"
      emptyText="You haven't posted anything yet. Tap + to post your first item."
      canDelete
    />
  );
}