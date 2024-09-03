import {Router} from "express"
import { addLectureToCourseById,getAllCourses,removeCourse,updateCourse,createCourse, getLecturesByCourseId } from "../controllers/course.controller.js";
import { isLoggedIn,authorizedRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";



const router=Router();

router.route('/')
.get(getAllCourses)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single("thumbnail"),
    createCourse)





// router.get("/",getAllCourses)
router.route("/:id")
.get(isLoggedIn,getLecturesByCourseId)
.put(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    updateCourse)
.delete(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    removeCourse)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single("lecture"),
    addLectureToCourseById)

// router.get("/:id",getLecturesByCourseId);

export default router;