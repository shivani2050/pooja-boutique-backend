
const Lead = require('../model/Lead');


const creatLeads =async (req,res)=>{
     

    try{

        const {name,phone,email,service, message}=req.body

         // Required fields
        if (!name || !phone || !service) {
            return res.status(400).json({
                status: false,
                message: "Name, phone and service are required"
            });
        }

         // Phone validation
        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                status: false,
                message: "Phone number must be exactly 10 digits"
            });
        }

        // Create lead
        const newLead = await Lead.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email ? email.trim() : "",
            service: service.trim(),
            message: message ? message.trim() : ""
        });


         console.log("Lead saved:", newLead);

        res.status(201).json({
            status: true,
            message: "Lead saved successfully",
            data: newLead
        });

    }catch (error) {

        console.log("Lead save error:", error.message);

        res.status(500).json({
            status: false,
            message: "Failed to save lead"
        });
    }
    
}


// get leads
const getLead = async(req,res)=>{
    try{
        const leads = await Lead.find().sort({createdAt: -1})
          res.status(200).json({
            status: true,
            message: "Leads fetched successfully",
            data: leads
        });
    }catch (error) {

        console.log("Get leads error:", error.message);

        res.status(500).json({
            status: false,
            message: "Failed to fetch leads"
        });
    }
}

// update leads

const updateLeadStatus = async(req,res)=>{
    try{
        const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Completed",
    ];

     if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status",
      });
    }

const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

     return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: lead,
    });

    } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    console.error("Update status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
}
}








module.exports = {
    creatLeads , 
    getLead,updateLeadStatus
}; 