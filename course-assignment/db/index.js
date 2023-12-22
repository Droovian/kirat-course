const express = require('express');

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017').then(()=>{
    console.log(`connected to the database`);
}).catch((err)=>{
    console.log(`unfortunately an error occured ${err}`);
});

const AdminSchema = new mongoose.Schema({
    username : String,
    password: String,
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}