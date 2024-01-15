import { Router } from "express";
import express from express


var USERS = []
Router.get("/", (req,res)=>{
    res.status(200).send(USERS)
})

Router.post("/", (req,res)=>{

    let body = req.body
    USERS.push(body.user)
})

module.exports = router