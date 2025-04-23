import { Router } from "express";
import { getInfo, searchMuseumsByLocation, searchMuseumsByType, updateTicketPrice 
                ,createMuseum,deleteMuseumById ,updateMuseumInfo,getAllMuseums, getMuseumById} from "../controllers/museumController";
import { authorize, protect } from '../Middlleware/authMiddleware';

const router = Router();

router.get("/searchByCategory", protect, authorize(["USER", "ADMIN"]), searchMuseumsByType);
router.get("/searchByTown", protect, authorize(["USER", "ADMIN"]), searchMuseumsByLocation);
router.get("/getInfo", protect, authorize(["USER", "ADMIN"]), getInfo);
router.get("/all",protect, authorize(["USER", "ADMIN"]), getAllMuseums);
router.patch("/updateTicketPrice/:id", protect, authorize(["ADMIN"]), updateTicketPrice);//done
router.patch("/updateMuseumInfo/:id", protect, authorize(["ADMIN"]), updateMuseumInfo);//done
router.post("/createMuseum", protect, authorize(["ADMIN"]), createMuseum);
router.delete("/deleteMuseumById/:id", protect, authorize(["ADMIN"]), deleteMuseumById);//done
router.get("/:id", protect, authorize(["USER", "ADMIN"]), getMuseumById);//done


export default router;