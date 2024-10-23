import fs from "node:fs/promises";
import os from "node:os";


/**converting a video to base64*/

// const  vidBase64 = await fs.readFile("vid.mp4",'base64')

// fs.writeFile("vid_base64.txt", vidBase64)

//////////////////////////////////////////////////////////////


/**reading base64 to reincarnate the video from base64 */
// const vidBase64 = await fs.readFile("vid_base64.txt", "utf-8")

// fs.writeFile("vid_reincarnated.mp4", vidBase64, "base64")



////////////////////////////////////////////////////////////////
/**os module in node */

console.log(os.type(),"\n",os.platform(),"\n",os.arch(),"\n",os.cpus(),"\n",os.totalmem(),"\n",os.freemem(),"\n",os.homedir(),"\n",os.hostname(),"\n",os.release(),"\n",os.uptime(),"\n",os.userInfo())