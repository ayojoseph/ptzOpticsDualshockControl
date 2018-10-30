var camera_ip = "192.168.2.246";
var base_url = "http://" + camera_ip + "/cgi-bin";

//Controller Work

ds = require("dualshock");
devices = ds.getDevices("ds4");
gamepad = ds.open(devices[0]);
// console.log("TYPE:      " + ds.getType(gamepad) + "       ");
// gamepad.rumble(255, 255, 5, 500);
gamepad.setLed(255, 255, 12);

// config defaults
var defaults = {
  ip: camera_ip,
  flip: 1,
  mirror: 1,
  invertcontrols: 0,
  infinitypt: 0,
  infinityzoom: 0,
  infinityfocus: 0,
  panspeed: 20,
  zoomspeed: 5,
  tiltspeed: 500,
  focusspeed: 3,
  autopaninterval: 60
};
var config = defaults;
config.ip = camera_ip;

function get_config() {
  var result = localStorage.getItem("configStorage");
  if (!result) {
    return config;
  } else {
    return JSON.parse(result);
  }
}

function save_config() {
  localStorage.setItem("configStorage", JSON.stringify(config));
  console.log(config);
}

function run_action(action_url) {
  console.log(action_url);
  // $.get(url);
  $.ajax({
    url: action_url,
    type: "GET"
  })
    .done(function() {
      // console.log("success");
    })
    .fail(function(jqXHR, responseText, errorThrown) {
      // console.log("error");
    })
    .always(function() {
      // console.log("complete");
    });
}

// setup all the initial configuration and standard settings
function config_init() {
  config = get_config();
  console.log(config);

  // set the initial IP value for the camera ip input
  $("#cam_ip").val(config.ip);
  base_url = "http://" + config.ip + "/cgi-bin";

  // set the camera's initial configuration for each value in the saved config object
  config_setting("flip", config.flip);
  config_setting("mirror", config.mirror);
  config_setting("invertcontrols", config.invertcontrols);
  config_setting("infinitypt", config.infinitypt);
  config_setting("infinityzoom", config.infinityzoom);
  config_setting("infinityfocus", config.infinityfocus);

  // set the initial values for each select dropdown
  $("#panspeed").val(config.panspeed);
  $("#zoomspeed").val(config.zoomspeed);
  $("#tiltspeed").val(config.tiltspeed);
  $("#focusspeed").val(config.focusspeed);
  $("#autopaninterval").val(config.autopaninterval);

  // save_config();

  if (config.infinitypt == 1) {
    $("#pt_infinity").show();
  } else {
    $("#pt_infinity").hide();
  }

  if (config.infinityzoom == 1) {
    $("#cam_zoom_infinity").show();
    $("#cam_zoom_standard").hide();
  } else {
    $("#cam_zoom_infinity").hide();
    $("#cam_zoom_standard").show();
  }

  if (config.infinityfocus == 1) {
    $("#cam_focus_infinity").show();
    $("#cam_focus_standard").hide();
  } else {
    $("#cam_focus_infinity").hide();
    $("#cam_focus_standard").show();
  }

  update_labels();
}

config_init();

function config_setting(action, value) {
  var loc = base_url + "/param.cgi?post_image_value&" + action + "&" + value;
  run_action(loc);
}

function update_labels() {
  switch (config.flip) {
    case 0:
      $("#flip").html("Flip-No");
      break;
    case 1:
      $("#flip").html("Flip-Yes");
      break;
  }

  switch (config.mirror) {
    case 0:
      $("#mirror").html("Mirror-No");
      break;
    case 1:
      $("#mirror").html("Mirror-Yes");
      break;
  }

  switch (config.invertcontrols) {
    case 0:
      $("#invertcontrols").html("Invert Controls-No");
      break;
    case 1:
      $("#invertcontrols").html("Invert Controls-Yes");
      break;
  }

  switch (config.infinitypt) {
    case 0:
      $("#infinitypt").html("Infinity Pan/Tilt-No");
      break;
    case 1:
      $("#infinitypt").html("Infinity Pan/Tilt-Yes");
      break;
  }

  switch (config.infinityzoom) {
    case 0:
      $("#infinityzoom").html("Infinity Zoom-No");
      break;
    case 1:
      $("#infinityzoom").html("Infinity Zoom-Yes");
      break;
  }

  switch (config.infinityfocus) {
    case 0:
      $("#infinityfocus").html("Infinity Focus-No");
      break;
    case 1:
      $("#infinityfocus").html("Infinity Focus-Yes");
      break;
  }

  config.ip = $("#cam_ip").val();
}

function reload_cam() {
  config.ip = $("#cam_ip").val();

  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      config.ip
    )
  ) {
    config.ip = config.ip;
    camera_ip = "192.168.2.246";
    base_url = "http://" + camera_ip + "/cgi-bin";
    // save_config();
    config_init();

    alert("New IP address saved.");
  } else {
    alert("IP address entered is invalid! Re-enter camera IP address.");
  }
}

function change_ip(cam) {
  if (cam == 1) {
    camera_ip = "192.168.2.246";
  } else {
    camera_ip = "192.168.2.243";
  }

  base_url = "http://" + camera_ip + "/cgi-bin";
}

function adjust_setting(action) {
  switch (action) {
    case "flip":
      switch (config.flip) {
        case 0:
          var loc = base_url + "/param.cgi?post_image_value&flip&1";
          run_action(loc);
          config.flip = 1;
          save_config();
          update_labels();
          break;

        case 1:
          var loc = base_url + "/param.cgi?post_image_value&flip&0";
          run_action(loc);
          config.flip = 0;
          save_config();
          update_labels();
          break;
      }
      break;

    case "mirror":
      switch (config.mirror) {
        case 0:
          var loc = base_url + "/param.cgi?post_image_value&mirror&1";
          run_action(loc);
          config.mirror = 1;
          save_config();
          update_labels();
          break;

        case 1:
          var loc = base_url + "/param.cgi?post_image_value&mirror&0";
          run_action(loc);
          config.mirror = 0;
          save_config();
          update_labels();
          break;
      }
      break;

    case "invertcontrols":
      switch (config.invertcontrols) {
        case 0:
          config.invertcontrols = 1;
          save_config();
          update_labels();
          break;

        case 1:
          config.invertcontrols = 0;
          save_config();
          update_labels();
          break;
      }
      break;

    case "infinitypt":
      switch (config.infinitypt) {
        case 0:
          config.infinitypt = 1;
          $("#pt_infinity").show();
          config.infinitypt = 1;
          save_config();
          update_labels();
          break;

        case 1:
          config.infinitypt = 0;
          $("#pt_infinity").hide();
          config.infinitypt = 0;
          save_config();
          update_labels();
          break;
      }
      break;

    case "infinityzoom":
      // console.log("Adjusting Infinity Zoom", config.infinityzoom);
      switch (config.infinityzoom) {
        case 0:
          config.infinityzoom = 1;
          $("#cam_zoom_infinity").show();
          $("#cam_zoom_standard").hide();
          config.infinityzoom = 1;
          save_config();
          update_labels();
          break;

        case 1:
          config.infinityzoom = 0;
          $("#cam_zoom_infinity").hide();
          $("#cam_zoom_standard").show();
          config.infinityzoom = 0;
          save_config();
          update_labels();
          break;
      }
      break;

    case "infinityfocus":
      switch (config.infinityfocus) {
        case 0:
          config.infinityfocus = 1;
          $("#cam_focus_infinity").show();
          $("#cam_focus_standard").hide();
          config.infinityfocus = 1;
          save_config();
          update_labels();
          break;

        case 1:
          config.infinityfocus = 0;
          $("#cam_focus_infinity").hide();
          $("#cam_focus_standard").show();
          config.infinityfocus = 0;
          save_config();
          update_labels();
          break;
      }
      break;
  }
}

// used for loading existing settings
function update_settings() {
  switch (config.flip) {
    case 0:
      var loc = base_url + "/param.cgi?post_image_value&flip&0";
      run_action(loc);
      break;

    case 1:
      var loc = base_url + "/param.cgi?post_image_value&flip&1";
      run_action(loc);
      break;
  }

  switch (config.mirror) {
    case 0:
      var loc = base_url + "/param.cgi?post_image_value&mirror&0";
      run_action(loc);
      update_labels();
      break;

    case 1:
      var loc = base_url + "/param.cgi?post_image_value&mirror&1";
      run_action(loc);
      update_labels();
      break;
  }

  switch (config.infinitypt) {
    case 0:
      $("#pt_infinity").hide();
      break;

    case 1:
      $("#pt_infinity").show();
      break;
  }

  switch (config.infinityzoom) {
    case 0:
      $("#cam_zoom_infinity").hide();
      $("#cam_zoom_standard").show();
      break;

    case 1:
      $("#cam_zoom_infinity").show();
      $("#cam_zoom_standard").hide();
      break;
  }

  switch (config.infinityfocus) {
    case 1:
      $("#cam_focus_infinity").hide();
      $("#cam_focus_standard").show();
      break;

    case 0:
      $("#cam_focus_infinity").show();
      $("#cam_focus_standard").hide();
      break;
  }

  update_labels();
}

function cam_pantilt(camera, action) {
  switch (action) {
    case "left":
      if (config.invertcontrols == "1") {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&right&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      } else {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&left&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      }
      break;

    case "right":
      if (config.invertcontrols == "1") {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&left&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      } else {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&right&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      }
      break;

    case "up":
      if (config.invertcontrols == "1") {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&down&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      } else {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&up&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      }
      break;

    case "down":
      if (config.invertcontrols == "1") {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&up&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      } else {
        var loc =
          base_url +
          "/ptzctrl.cgi?ptzcmd&down&" +
          config.panspeed +
          "&" +
          config.tiltspeed +
          "";
      }
      break;

    case "home":
      var loc =
        base_url +
        "/ptzctrl.cgi?ptzcmd&home&" +
        config.panspeed +
        "&" +
        config.tiltspeed +
        "";
      break;

    case "stop":
      var loc = base_url + "/ptzctrl.cgi?ptzcmd&ptzstop";
      break;
  }

  run_action(loc);
}

function cam_zoom(camera, action) {
  var loc =
    base_url + "/ptzctrl.cgi?ptzcmd&" + action + "&" + config.zoomspeed + "";
  run_action(loc);
}

function cam_focus(camera, action) {
  var loc =
    base_url + "/ptzctrl.cgi?ptzcmd&" + action + "&" + config.focusspeed + "";
  run_action(loc);
}

function cam_preset(camera, positionnum, action) {
  var loc = base_url + "/ptzctrl.cgi?ptzcmd&" + action + "&" + positionnum + "";
  run_action(loc);
}

// $(".alert").fadeTo(2000, 500).slideUp(500, function(){
// 	$(".alert").alert('close');
// });

var autoInterval;
var panInterval;
var panning;
var autopanning = false;

function autopan() {
  var seconds = config.autopaninterval;
  autopanning = true;

  // preset 11 is the autopan start preset
  cam_preset(1, 11, "poscall");

  // wait 1 second before starting the pan
  // this should give the camera enough time to pan to start position
  setTimeout(function() {
    console.log("start panning right");
    pan("right");

    autoInterval = setInterval(function() {
      if (panning == "left") {
        clearInterval(panInterval);
        console.log("start panning right");
        pan("right");
      } else if (panning == "right") {
        clearInterval(panInterval);
        console.log("start panning left");
        pan("left");
      }
    }, seconds * 1000);
  }, 1000);
}

function pan(direction) {
  var panspeed = 1;
  var tiltspeed = 1;

  panInterval = setInterval(function() {
    if (direction == "left") {
      panning = "left";

      if (config.invertcontrols == "1") {
        var loc =
          base_url + "/ptzctrl.cgi?ptzcmd&right&" + panspeed + "&" + tiltspeed;
      } else {
        var loc =
          base_url + "/ptzctrl.cgi?ptzcmd&left&" + panspeed + "&" + tiltspeed;
      }
      console.log("...pan left");
    } else if (direction == "right") {
      panning = "right";

      if (config.invertcontrols == "1") {
        var loc =
          base_url + "/ptzctrl.cgi?ptzcmd&left&" + panspeed + "&" + tiltspeed;
      } else {
        var loc =
          base_url + "/ptzctrl.cgi?ptzcmd&right&" + panspeed + "&" + tiltspeed;
      }
      console.log("...pan right");
    }
    run_action(loc);
  }, 1000);
}

function stop_autopan() {
  if (autoInterval) {
    clearInterval(autoInterval);
  }
  if (panInterval) {
    clearInterval(panInterval);
  }
  autopanning = false;
  cam_pantilt(1, "stop");
  $(".autopan").removeClass("active");
}

function clear_active_preset() {
  $(".preset_button").removeClass("active");
}

$("body").on("click", ".autopan", function(e) {
  e.preventDefault();
  clear_active_preset();
  cam_pantilt(1, "stop");

  if (autopanning == false) {
    autopan();
    $(this).addClass("active");
  } else {
    stop_autopan();
  }
  return false;
});

/* ------------------------------------ Mouse Events & Clicks
 */

$("body").on("click", ".adjust_setting", function(e) {
  e.preventDefault();
  var action = $(this).data("action");
  adjust_setting(action);
  return false;
});

$("body").on("change", "select.change_setting", function(e) {
  e.preventDefault();
  var action = $(this).attr("id");
  config[action] = $(this).val();
  save_config();
  return false;
});

$("body").on("click", ".call_preset", function(e) {
  e.preventDefault();
  stop_autopan();
  var preset = $(this).data("preset");
  cam_preset(1, preset, "poscall");
  clear_active_preset();
  $(this).addClass("active");
  return false;
});

$("body").on("click", ".assign_preset", function(e) {
  e.preventDefault();
  var preset = $(this).val();
  if (preset == "Auto Pan Left Start Position") {
    preset = 11;
  }
  cam_preset(1, preset, "posset");
  return false;
});

$("body").on("click", ".reload_cam", function(e) {
  e.preventDefault();
  reload_cam();
  return false;
});

$("body").on("mousedown", ".adjust_pantilt", function(e) {
  e.preventDefault();
  stop_autopan();
  var action = $(this).data("action");
  cam_pantilt(1, action);
  clear_active_preset();
  return false;
});
$("body").on("mouseup mouseout mouseleave", ".adjust_pantilt", function(e) {
  e.preventDefault();
  cam_pantilt(1, "stop");
  return false;
});

$("body").on("mousedown", ".adjust_zoom", function(e) {
  e.preventDefault();
  stop_autopan();
  var action = $(this).data("action");
  cam_zoom(1, action);
  clear_active_preset();
  return false;
});
$("body").on("mouseup mouseout mouseleave", ".adjust_zoom", function(e) {
  e.preventDefault();
  cam_zoom(1, "zoomstop");
  return false;
});

$("body").on("mousedown", ".adjust_focus", function(e) {
  e.preventDefault();
  stop_autopan();
  var action = $(this).data("action");
  cam_focus(1, action);
  clear_active_preset();
  return false;
});
$("body").on("mouseup mouseout mouseleave", ".adjust_focus", function(e) {
  e.preventDefault();
  cam_focus(1, "focusstop");
  return false;
});

// visual only toggle rocker buttons
$("body").on("mousedown", ".toggle-up", function(e) {
  e.preventDefault();
  $(this)
    .parents(".rocker")
    .addClass("rocker-up");
});
$("body").on("mouseup mouseout mouseleave", ".toggle-up", function(e) {
  e.preventDefault();
  $(this)
    .parents(".rocker")
    .removeClass("rocker-up");
});

$("body").on("mousedown", ".toggle-down", function(e) {
  e.preventDefault();
  $(this)
    .parents(".rocker")
    .addClass("rocker-down");
});
$("body").on("mouseup mouseout mouseleave", ".toggle-down", function(e) {
  e.preventDefault();
  $(this)
    .parents(".rocker")
    .removeClass("rocker-down");
});

/* ------------------------------------ Keyboard Events
 */

// HOME
Mousetrap.bind(
  "home",
  function(e) {
    stop_autopan();
    cam_pantilt(1, "home");
    $(".pantilt-home").addClass("active");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "home",
  function(e) {
    cam_pantilt(1, "stop");
    $(".pantilt-home").removeClass("active");
    clear_active_preset();
    return false;
  },
  "keyup"
);

// UP
Mousetrap.bind(
  "up",
  function(e) {
    stop_autopan();
    cam_pantilt(1, "up");
    $(".pantilt-up").addClass("active");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "up",
  function(e) {
    cam_pantilt(1, "stop");
    $(".pantilt-up").removeClass("active");
    clear_active_preset();
    return false;
  },
  "keyup"
);

// DOWN
Mousetrap.bind(
  "down",
  function(e) {
    stop_autopan();
    cam_pantilt(1, "down");
    $(".pantilt-down").addClass("active");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "down",
  function(e) {
    cam_pantilt(1, "stop");
    $(".pantilt-down").removeClass("active");
    clear_active_preset();
    return false;
  },
  "keyup"
);

// LEFT
Mousetrap.bind(
  "left",
  function(e) {
    stop_autopan();
    cam_pantilt(1, "left");
    $(".pantilt-left").addClass("active");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "left",
  function(e) {
    cam_pantilt(1, "stop");
    $(".pantilt-left").removeClass("active");
    clear_active_preset();
    return false;
  },
  "keyup"
);

// RIGHT
Mousetrap.bind(
  "right",
  function(e) {
    stop_autopan();
    cam_pantilt(1, "right");
    $(".pantilt-right").addClass("active");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "right",
  function(e) {
    cam_pantilt(1, "stop");
    $(".pantilt-right").removeClass("active");
    clear_active_preset();
    return false;
  },
  "keyup"
);

// ZOOM IN
Mousetrap.bind(
  "a",
  function(e) {
    stop_autopan();
    cam_zoom(1, "zoomin");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "a",
  function(e) {
    cam_zoom(1, "zoomstop");
    return false;
  },
  "keyup"
);

// ZOOM OUT
Mousetrap.bind(
  "z",
  function(e) {
    stop_autopan();
    cam_zoom(1, "zoomout");
    clear_active_preset();
    return false;
  },
  "keydown"
);

Mousetrap.bind(
  "z",
  function(e) {
    cam_zoom(1, "zoomstop");
    return false;
  },
  "keyup"
);

//GAMEPAD EVENTS

gamepad.ondigital = function(button, value) {
  //DOWN
  if (button == "down") {
    if (value) {
      stop_autopan();
      cam_pantilt(1, "down");
      $(".pantilt-down").addClass("active");
      clear_active_preset();
    } else {
      cam_pantilt(1, "stop");
      $(".pantilt-down").removeClass("active");
      clear_active_preset();
    }
  }

  //UP
  if (button == "up") {
    if (value) {
      stop_autopan();
      cam_pantilt(1, "up");
      $(".pantilt-up").addClass("active");
      clear_active_preset();
    } else {
      cam_pantilt(1, "stop");
      $(".pantilt-up").removeClass("active");
      clear_active_preset();
    }
  }

  //LEFT
  if (button == "left") {
    if (value) {
      stop_autopan();
      cam_pantilt(1, "left");
      $(".pantilt-left").addClass("active");
      clear_active_preset();
    } else {
      cam_pantilt(1, "stop");
      $(".pantilt-left").removeClass("active");
      clear_active_preset();
    }
  }

  //RIGHT
  if (button == "right") {
    if (value) {
      stop_autopan();
      cam_pantilt(1, "right");
      $(".pantilt-right").addClass("active");
      clear_active_preset();
    } else {
      cam_pantilt(1, "stop");
      $(".pantilt-right").removeClass("active");
      clear_active_preset();
    }
  }

  //ZOOM-IN
  if (button == "y") {
    if (value) {
      stop_autopan();
      cam_zoom(1, "zoomin");
      clear_active_preset();
    } else {
      cam_zoom(1, "zoomstop");
    }
  }

  //ZOOM OUT
  if (button == "a") {
    if (value) {
      stop_autopan();
      cam_zoom(1, "zoomout");
      clear_active_preset();
    } else {
      cam_zoom(1, "zoomstop");
    }
  }

  //FOCUS-IN
  if (button == "b") {
    if (value) {
      stop_autopan();
      cam_focus(1, "focusin");
      clear_active_preset();
    } else {
      cam_focus(1, "focusstop");
    }
  }

  //FOCUS OUT
  if (button == "x") {
    if (value) {
      stop_autopan();
      cam_focus(1, "focusout");
      clear_active_preset();
    } else {
      cam_focus(1, "focusstop");
    }
  }

  //SWITCH CAMERA
  if (button == "r1") {
    change_ip(1);
  }

  if (button == "l1") {
    change_ip(0);
  }

  //PRESETS 1 AND 2
  if (button == "r2") {
    stop_autopan();
    cam_preset(1, 1, "poscall");
    clear_active_preset();
    $(".preset").addClass("active");
  }

  if (button == "l2") {
    stop_autopan();
    cam_preset(1, 2, "poscall");
    clear_active_preset();
    $(".preset").addClass("active");
  }
};

// gamepad.onupdate = function(changed) {
//   // var Yax = this.analog.lStickY;
//   if (this.analog.lStickY < 117) {
//     stop_autopan();
//     // cam_pantilt(1, "up");
//     // $(".pantilt-up").addClass("active");
//     if (config.invertcontrols == "1") {
//       var loc =
//         base_url +
//         "/ptzctrl.cgi?ptzcmd&down&" +
//         config.panspeed +
//         "&" +
//         20 +
//         "";
//     } else {
//       var loc =
//         base_url + "/ptzctrl.cgi?ptzcmd&up&" + config.panspeed + "&" + 20 + "";
//     }
//     run_action(loc);

//     clear_active_preset();
//   } else if ((this.analog.lStickY < 137) & (this.analog.lStickY > 117)) {
//     // cam_pantilt(1, "stop");
//     // $(".pantilt-up").removeClass("active");
//     // clear_active_preset();
//   }
// };

// gamepad.onanalog = function(axis, value) {
//   if (axis == "lStickY") {
//     var Yax = value;
//   }
//   if (Yax < 110) {
//     stop_autopan();
//     cam_pantilt(1, "up");
//     $(".pantilt-up").addClass("active");
//     clear_active_preset();
//   }
//   if (Yax > 140) {
//     stop_autopan();
//     cam_pantilt(1, "down");
//     $(".pantilt-up").addClass("active");
//     clear_active_preset();
//   }
// };

const { remote } = require("electron");
const { app } = remote;

app.on("before-quit", () => {
  // reset the camera to home position before closing the application
  cam_pantilt(1, "home");
});
