import RecipesSearchBar from "@/app/components/RecipesSearch/RecipesSearchBar";
import Container from "@/app/components/ui/Container";

export default function RecipesSearch() {
  return (
    <Container>
      <RecipesSearchBar />
      {/* <> */}
        {/* <FishSearchInput
          lastFishQuery={lastFishQuery}
          setLastFishQuery={setLastFishQuery}
          setFish={setFish} 
        /> */}
        
        {/* {loading ? (
          <Text>
            { getTranslation('common.loading', language) }
          </Text>
        ) : fish?.length === 0 || undefined ? (
            <Text>
              { getTranslation('fishSearch.fishNotFound', language) }
            </Text>
        ) : (
          <FishList fish={fish} />
        )} */}
      {/* </> */}
    </Container>
  )
}