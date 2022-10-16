import { Button, Grid, Link, Stack, Text } from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import { useMemo, useState } from "react";
import api from "../product/api";
import { Product } from "../product/type";

interface Props {
  products: Product[];
}


function parseCurrency(value: number): string{
  return value.toLocaleString("es-AR", {
    style: 'currency',
    currency: 'ARS'
  })
}

const Home: NextPage<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);

  if (!products) return <div>Loading...</div>;

  function handleAddToCart(product: Product) {
    setCart((cart) => cart.concat(product));
  }

  const text = useMemo(() => {
    return cart
    .reduce(
      (message, product) =>
      message.concat(`* ${product.title} - ${ parseCurrency(product.price)}\n`),
      ""
    )
    .concat(
      `\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`
    );
  }, [cart])

  return (
    <Stack>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack key={product.id} backgroundColor="gray.100">
            <Text>{product.title}</Text>
            <Text>{ parseCurrency(product.price)}</Text>
            <Button colorScheme="blue" onClick={() => handleAddToCart(product)}>
              Add
            </Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Button
          as={Link}
          href={`https://wa.me/5491111111111?text=${encodeURIComponent(text)}`}
          isExternal
          colorScheme="whatsapp"
        >
          Complete order ({cart.length}) products{" "}
        </Button>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    props: {
      products,
    },
  };
};

export default Home;
