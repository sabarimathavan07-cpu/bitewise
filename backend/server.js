const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// HOME API
// ===============================

app.get("/", (req, res) => {
    res.send("BiteWise Backend is Running!");
});


// ===============================
// RESTAURANTS API
// ===============================

app.get("/api/restaurants", (req, res) => {

    const sql = "SELECT * FROM Restaurants";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Restaurant error:", err);

            return res.status(500).json({
                error: "Failed to fetch restaurants"
            });
        }

        res.json(results);
    });

});


// ===============================
// FOODS API
// ===============================

app.get("/api/foods", (req, res) => {

    const sql = "SELECT * FROM Foods";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Food error:", err);

            return res.status(500).json({
                error: "Failed to fetch foods"
            });
        }

        res.json(results);
    });

});


// ===============================
// PRICE COMPARISON API
// ===============================

app.get("/api/compare/:foodId", (req, res) => {

    const foodId = req.params.foodId;

    const sql = `
        SELECT
            comparison_id,
            food_id,
            platform,
            food_price,
            delivery_fee,
            rating,
            final_price
        FROM Price_Comparisons
        WHERE food_id = ?
        ORDER BY final_price ASC
    `;

    db.query(sql, [foodId], (err, results) => {

        if (err) {
            console.error("Comparison error:", err);

            return res.status(500).json({
                error: "Failed to fetch price comparison"
            });
        }

        res.json(results);
    });

});


// ===============================
// CREATE ORDER API
// ===============================

app.post("/api/orders", (req, res) => {

    const {
        user_id,
        total_amount,
        payment_method,
        items
    } = req.body;


    // ===============================
    // VALIDATE ORDER DATA
    // ===============================

    if (!user_id || !total_amount || !payment_method) {

        return res.status(400).json({
            error: "user_id, total_amount and payment_method are required"
        });

    }


    // ===============================
    // CHECK CART ITEMS
    // ===============================

    if (!Array.isArray(items) || items.length === 0) {

        return res.status(400).json({
            error: "Order must contain at least one item"
        });

    }


    // ===============================
    // START DATABASE TRANSACTION
    // ===============================

    db.beginTransaction((transactionError) => {

        if (transactionError) {

            console.error(
                "Transaction start error:",
                transactionError
            );

            return res.status(500).json({
                error: "Failed to start order transaction"
            });

        }


        // ===============================
        // INSERT INTO ORDERS
        // ===============================

        const orderSql = `
            INSERT INTO Orders
            (
                user_id,
                total_amount,
                payment_method,
                order_status
            )
            VALUES (?, ?, ?, 'Pending')
        `;


        db.query(
            orderSql,
            [
                user_id,
                total_amount,
                payment_method
            ],
            (orderError, orderResult) => {

                if (orderError) {

                    console.error(
                        "Order insert error:",
                        orderError
                    );

                    return db.rollback(() => {

                        res.status(500).json({
                            error: "Failed to create order"
                        });

                    });

                }


                const orderId = orderResult.insertId;


                // ===============================
                // PREPARE ORDER ITEMS
                // ===============================

                const orderItems = [];

                for (const item of items) {

                    const foodId = Number(
                        item.food_id ??
                        item.foodId ??
                        item.id
                    );

                    const quantity = Number(
                        item.quantity || 1
                    );

                    const price = Number(
                        item.price || 0
                    );


                    // Validate food ID

                    if (!foodId || foodId <= 0) {

                        return db.rollback(() => {

                            res.status(400).json({
                                error: "Invalid food_id in order items"
                            });

                        });

                    }


                    // Validate quantity

                    if (!quantity || quantity <= 0) {

                        return db.rollback(() => {

                            res.status(400).json({
                                error: "Invalid quantity in order items"
                            });

                        });

                    }


                    orderItems.push([
                        orderId,
                        foodId,
                        quantity,
                        price
                    ]);

                }


                // ===============================
                // INSERT ORDER ITEMS
                // ===============================

                const itemSql = `
                    INSERT INTO Order_Items
                    (
                        order_id,
                        food_id,
                        quantity,
                        price
                    )
                    VALUES ?
                `;


                db.query(
                    itemSql,
                    [orderItems],
                    (itemError) => {

                        if (itemError) {

                            console.error(
                                "Order items error:",
                                itemError
                            );

                            return db.rollback(() => {

                                res.status(500).json({
                                    error: "Failed to save order items"
                                });

                            });

                        }


                        // ===============================
                        // COMMIT TRANSACTION
                        // ===============================

                        db.commit((commitError) => {

                            if (commitError) {

                                console.error(
                                    "Commit error:",
                                    commitError
                                );

                                return db.rollback(() => {

                                    res.status(500).json({
                                        error: "Failed to complete order"
                                    });

                                });

                            }


                            // ===============================
                            // SUCCESS RESPONSE
                            // ===============================

                            res.status(201).json({

                                message:
                                    "Order and order items created successfully",

                                order_id: orderId,

                                item_count: orderItems.length

                            });

                        });

                    }
                );

            }
        );

    });

});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `BiteWise server running on port ${PORT}`
    );

});