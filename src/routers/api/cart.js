import { Router } from "express";
import { returnMessage } from "../../utils/functions.js";

import productsApi from "../../api/products.js";
import cartApi from "../../api/carts.js";

const cartApiRouter = Router();

cartApiRouter.get("/", async (_, res) => {
  const result = await cartApi.getAll();
  const cartsIds = result.payload
    ? result.payload.map((product) => product.id)
    : [];
  res
    .status(200)
    .json(returnMessage(false, 200, "Carritos encontrados", cartsIds));
});

cartApiRouter.post("/", async (_, res) => {
  const cart = await cartApi.createOne();
  res.status(cart.code).json(cart);
});

cartApiRouter.delete("/:id", async (req, res) => {
  const id = /^\d+$/.test(req.params.id)
    ? parseInt(req.params.id)
    : req.params.id;
  const cart = await cartApi.deleteOneById(id);
  res.status(cart.code).json(cart);
});

cartApiRouter.get("/:id/productos", async (req, res) => {
  const id = /^\d+$/.test(req.params.id)
    ? parseInt(req.params.id)
    : req.params.id;
  const cart = await cartApi.getOneById(id);
  if (cart.code !== 200) {
    res.status(cart.code).json(cart);
  } else {
    res
      .status(cart.code)
      .json(
        returnMessage(
          false,
          200,
          "Productos encontrados",
          cart.payload.productos
        )
      );
  }
});

cartApiRouter.post("/:id/productos", async (req, res) => {
  const id = /^\d+$/.test(req.params.id)
    ? parseInt(req.params.id)
    : req.params.id;
  const productsIds = req.body.productos.map((id) =>
    /^\d+$/.test(id) ? parseInt(id) : id
  );
  const products = (await productsApi.getListByIds(productsIds)).payload;
  const result = await cartApi.addProducts(id, products);
  res.status(result.code).json(result);
});

cartApiRouter.delete("/:id/productos/:productId", async (req, res) => {
  const id = /^\d+$/.test(req.params.id)
    ? parseInt(req.params.id)
    : req.params.id;
  const productId = /^\d+$/.test(req.params.productId)
    ? parseInt(req.params.productId)
    : req.params.productId;
  const cart = await cartApi.deleteProduct(id, productId);
  res.status(cart.code).json(cart);
});

export default cartApiRouter;
