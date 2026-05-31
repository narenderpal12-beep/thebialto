import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import floorsRouter from "./floors";
import roomsRouter from "./rooms";
import bookingsRouter from "./bookings";
import attractionsRouter from "./attractions";
import reviewsRouter from "./reviews";
import galleryRouter from "./gallery";
import amenitiesRouter from "./amenities";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/floors", floorsRouter);
router.use("/rooms", roomsRouter);
router.use("/bookings", bookingsRouter);
router.use("/attractions", attractionsRouter);
router.use("/reviews", reviewsRouter);
router.use("/gallery", galleryRouter);
router.use("/amenities", amenitiesRouter);
router.use("/settings", settingsRouter);
router.use("/dashboard", dashboardRouter);

export default router;
