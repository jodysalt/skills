/* The shared widgets every course under docs/courses/ gets. Vanilla, no dependencies. Edit only when every course should change.
 *
 * Markup each widget enhances:
 *
 * Try it – a control drives a figure:
 *   <input type="range" data-var="n" min="1" max="10" value="3"> <output data-show="n"></output>
 *   Every [data-show="n"] gets the value as text. Inline script draws the figure:
 *   course.bind("n", function (n, vars) { ... }); – called now and on every change.
 *
 * Check – a quiz:
 *   <form class="quiz" data-answer="b" data-right="Yes – …" data-wrong="Not quite – …">
 *     <p>Question?</p>
 *     <label><input type="radio" name="q" value="a"> …</label>
 *     <label><input type="radio" name="q" value="b"> …</label>
 *     <button class="button secondary">Check</button>
 *     <p class="feedback"></p>
 *   </form>
 *
 * Stepper – one <section> shown at a time:
 *   <div class="stepper"><section>…</section><section>…</section></div>
 *
 * Reveal – native <details><summary>…</summary>…</details>, no script needed.
 *
 * Progress – a lesson marks itself complete, remembered in localStorage only:
 *   <button class="button mark-complete" data-lesson="1">Mark complete</button>
 *   An overview's <ol class="lessons"> gets .done on each <li data-lesson="n"> completed.
 */
(function () {
  "use strict";

  var course = (window.course = window.course || {});
  var vars = {};
  var handlers = {};

  function coerce(input) {
    var v = input.value;
    if (input.type === "checkbox") return input.checked;
    return input.type === "range" || input.type === "number" ? Number(v) : v;
  }

  function emit(name) {
    document.querySelectorAll('[data-show="' + name + '"]').forEach(function (el) {
      var v = vars[name];
      var digits = el.getAttribute("data-digits");
      el.textContent = digits !== null && typeof v === "number" ? v.toFixed(Number(digits)) : String(v);
    });
    (handlers[name] || []).forEach(function (fn) {
      fn(vars[name], vars);
    });
  }

  course.get = function (name) {
    return vars[name];
  };

  course.bind = function (name, fn) {
    (handlers[name] = handlers[name] || []).push(fn);
    if (name in vars) fn(vars[name], vars);
  };

  function bindVars() {
    document.querySelectorAll("[data-var]").forEach(function (input) {
      var name = input.getAttribute("data-var");
      vars[name] = coerce(input);
      input.addEventListener("input", function () {
        vars[name] = coerce(input);
        emit(name);
      });
    });
    Object.keys(vars).forEach(emit);
  }

  function bindQuizzes() {
    document.querySelectorAll("form.quiz").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var picked = form.querySelector("input:checked");
        var feedback = form.querySelector(".feedback");
        if (!feedback) return;
        if (!picked) {
          feedback.className = "feedback";
          feedback.textContent = "Pick an answer first.";
          return;
        }
        var right = picked.value === form.getAttribute("data-answer");
        feedback.className = "feedback " + (right ? "right" : "wrong");
        feedback.textContent = form.getAttribute(right ? "data-right" : "data-wrong") || (right ? "Right." : "Not quite – try again.");
      });
    });
  }

  function bindSteppers() {
    document.querySelectorAll(".stepper").forEach(function (stepper) {
      var steps = Array.prototype.slice.call(stepper.children).filter(function (el) {
        return el.tagName === "SECTION";
      });
      if (!steps.length) return;
      var i = 0;
      var bar = document.createElement("div");
      bar.className = "stepper-bar";
      var prev = document.createElement("button");
      prev.className = "button secondary";
      prev.type = "button";
      prev.textContent = "Back";
      var next = document.createElement("button");
      next.className = "button";
      next.type = "button";
      next.textContent = "Next";
      var count = document.createElement("span");
      count.className = "count";
      bar.appendChild(prev);
      bar.appendChild(next);
      bar.appendChild(count);
      stepper.appendChild(bar);
      function show() {
        steps.forEach(function (s, k) {
          s.classList.toggle("current", k === i);
        });
        prev.disabled = i === 0;
        next.disabled = i === steps.length - 1;
        count.textContent = "Step " + (i + 1) + " of " + steps.length;
      }
      prev.addEventListener("click", function () {
        if (i > 0) i--;
        show();
      });
      next.addEventListener("click", function () {
        if (i < steps.length - 1) i++;
        show();
      });
      show();
    });
  }

  /* Progress: key "course:{slug}" holds a JSON array of completed lesson numbers. {slug} is the folder name. */
  function slug() {
    var parts = location.pathname.split("/").filter(Boolean);
    return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "course";
  }
  function readDone() {
    try {
      return JSON.parse(localStorage.getItem("course:" + slug()) || "[]");
    } catch (e) {
      return [];
    }
  }
  function writeDone(list) {
    try {
      localStorage.setItem("course:" + slug(), JSON.stringify(list));
    } catch (e) {
      /* storage unavailable: the page works without it */
    }
  }

  function bindProgress() {
    var done = readDone();
    document.querySelectorAll(".mark-complete[data-lesson]").forEach(function (button) {
      var n = button.getAttribute("data-lesson");
      function paint() {
        var isDone = done.indexOf(n) !== -1;
        button.classList.toggle("done", isDone);
        button.textContent = isDone ? "Completed ✓" : "Mark complete";
      }
      button.addEventListener("click", function () {
        var k = done.indexOf(n);
        if (k === -1) done.push(n);
        else done.splice(k, 1);
        writeDone(done);
        paint();
      });
      paint();
    });
    document.querySelectorAll(".lessons li[data-lesson]").forEach(function (li) {
      li.classList.toggle("done", done.indexOf(li.getAttribute("data-lesson")) !== -1);
    });
  }

  function init() {
    bindVars();
    bindQuizzes();
    bindSteppers();
    bindProgress();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
