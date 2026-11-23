import ListingsScreen from '../components/ListingsScreen';

export default function SavedItems() {
  return (
    <ListingsScreen
      title="Saved items"
      endpoint="/api/profile/saved"
      emptyText="Nothing saved yet. Tap the star on an item to save it."
      canUnsave
    />
  );
}