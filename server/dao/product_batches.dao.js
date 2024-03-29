const pool = require("./pool");

module.exports = {
  getProductBatches: async (productID) => {
    const sql = `
    SELECT *
    FROM product_batches pb
    WHERE product_id = $1`;

    try {
      return await pool.query(sql, [productID]);
    } catch (err) {
      throw err;
    }
  },
  getProductBatchesByBusinessID: async (params) => {
    try {
      const { businessID } = params;

      const sql = `select pb.*, pr.name from product_batches pb, product pr
      where pb.product_id = pr.product_id AND pr.business_id = $1`;

      return await pool.query(sql, [businessID]);
    } catch (err) {
      throw err;
    }
  },
  getProductBatchesByProductBatchID: async (id) => {
    try {
      const sql = `select pb.*, pr.name from product_batches pb, product pr
      where pb.product_id = pr.product_id AND pb.product_batch_id = $1`;

      return await pool.query(sql, [id]);
    } catch (err) {
      throw err;
    }
  },
  deleteAllProductBatchByProductID: async (params) => {
    try {
      const { productID } = params;

      const sql = "DELETE FROM product_batches WHERE product_id = $1";

      return await pool.query(sql, [productID]);
    } catch (err) {
      throw err;
    }
  },
  deleteProductBatch: async (params) => {
    const { productBatchID, businessID } = params;

    const sql = `
    DELETE FROM product_batches pb
    USING product p
    WHERE pb.product_batch_id = $1 AND pb.product_id = p.product_id AND p.business_id = $2
    RETURNING pb.*`;

    try {
      return await pool.query(sql, [productBatchID, businessID]);
    } catch (err) {
      throw err;
    }
  },

  postProductBatch: async (params) => {
    const { productID, productionDate, expiryDate, qty, status } = params;

    const sql = `
    INSERT
    INTO product_batches
    VALUES
    (default, $1, $2, $3, $4, $5)
    RETURNING *`;

    try {
      return await pool.query(sql, [
        productID,
        productionDate,
        expiryDate,
        qty,
        status,
      ]);
    } catch (err) {
      throw err;
    }
  },

  updateProductBatch: async (params) => {
    const {
      productionDate,
      expiryDate,
      qty,
      productBatchID,
      status,
      businessID,
    } = params;

    let i = 1;

    let sqlParam = [];
    let arrParam = [];

    if (productionDate) {
      sqlParam.push(`production_date = $${i++}`);
      arrParam.push(productionDate);
    }

    if (expiryDate) {
      sqlParam.push(`expiry_date = $${i++}`);
      arrParam.push(expiryDate);
    }

    if (qty || qty === 0) {
      sqlParam.push(`qty = $${i++}`);
      arrParam.push(qty);
    }

    if (status) {
      sqlParam.push(`status = $${i++}`);
      arrParam.push(status);
      console.log(status);
    }

    const sql = `
    UPDATE product_batches pb SET
    ${sqlParam.join(", ")}
    FROM product p
    WHERE pb.product_batch_id = $${i++} AND pb.product_id = p.product_id AND p.business_id = $${i++}
    RETURNING pb.*`;

    console.log(sql);

    try {
      return await pool.query(sql, [...arrParam, productBatchID, businessID]);
    } catch (err) {
      throw err;
    }
  },
};
