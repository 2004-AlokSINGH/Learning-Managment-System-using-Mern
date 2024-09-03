import { count } from 'console';
import Course from '../models/course.model.js'
import AppError from '../utils/error.util.js';
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import path from 'path';

const getAllCourses= async function(req,res,next){
    try{
    const courses= await Course.find({}).select('-lectures');

    res.status(200).json({
        success:true,
        message:"All courses here",
        courses,

    })
} catch(e){
    return next(new AppError(e.message,500))
}

}

const getLecturesByCourseId=async(req,res,next)=>{

    try{
        const { id } = req.params;

        const course = await Course.findById(id);
      
        if (!course) {
          return next(new AppError('Invalid course id or course not found.', 404));
        }
      
        res.status(200).json({
          success: true,
          message: 'Course lectures fetched successfully',
          lectures: course.lectures,
        });

    }catch(e){
        return next(new AppError(e.message,500))
    }

}

const createCourse=async function(req,res,next){
   try{
    const{title,description,category,createdBy}=req.body;

    if (!title || !description || !category || !createdBy){
        return next(new AppError('All fields are required',400))

    }

    const course=await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'dummy',
            secure_url: 'dummy'
          },

    })
    if (!course){
        return next(new AppError('Course could not created, please try again',500))
    }
    if(req.file){
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
        });
        if(result){
            course.thumbnail.public_id=result.public_id,
            course.thumbnail.secure_url=result.secure_url
        }

        fs.rm(`uploads/${req.file.filename}`)
    }

    await course.save();
    res.status(200).json({
        success:true,
        message:'Course created successfully!!',
        course,
    })


   }catch(e){
    return next(new AppError(e.message,500))
   }

}

const updateCourse=async function(req,res,next){
    try{
        const {id}=req.params;
        const course=await Course.findByIdAndUpdate(
            id,
            {
            $set:req.body
            },
            {
                runValidators:true
            }
      )
      if (!course){
        return next(
            new AppError("Course with give id not exists",500)
        )
      }
      res.status(200).json({
        success:true,
        message:'Course updated successfully!',
        course
      })



    }catch(e){
        return next(new AppError(e.message,500))
    }

}

const removeCourse=async function(req,res,next){
    try{
        const {id}=req.params;

        const course=await Course.findById(id);
        if(!course){
            return next(new AppError("Course nt exist",500))
            
        }
        await Course.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:'Course deleted successfully!!'
        })



    }catch(e){
        return next(new AppError(e.message,500))
    }

}

const addLectureToCourseById=async function(req,res,next){
    const { title, description } = req.body;
    const { id } = req.params;
  
    let lectureData = {};
  
    if (!title || !description) {
      return next(new AppError('Title and Description are required', 400));
    }
  
    const course = await Course.findById(id);
  
    if (!course) {
      return next(new AppError('Invalid course id or course not found.', 400));
    }
  
    // Run only if user sends a file
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms', // Save files in a folder named lms
          chunk_size: 50000000, // 50 mb size
          resource_type: 'video',
        });
  
        // If success
        if (result) {
          // Set the public_id and secure_url in array
          lectureData.public_id = result.public_id;
          lectureData.secure_url = result.secure_url;
        }
  
        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        // Empty the uploads directory without deleting the uploads directory
        for (const file of await fs.readdir('uploads/')) {
          await fs.unlink(path.join('uploads/', file));
        }
  
        // Send the error message
        return next(
          new AppError(
            JSON.stringify(error) || 'File not uploaded, please try again',
            400
          )
        );
      }
    }
  
    course.lectures.push({
      title,
      description,
      lecture: lectureData,
    });
  
    course.numberOfLectures = course.lectures.length;
  
    // Save the course object
    await course.save();
  
    res.status(200).json({
      success: true,
      message: 'Course lecture added successfully',
      course,
    });
  };
  
  




export{
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById
}