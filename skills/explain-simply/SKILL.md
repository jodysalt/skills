---
name: explain-simply
description: Explains a subject in plain language in the conversation, a TL;DR first and then one paragraph of detail per yes until the subject is covered or the user moves on. Use when the user says "explain this simply", "give me a TL;DR", "explain it like I'm five", "dumb this down", or runs `/explain-simply`. Writes no file, never changes the subject mid-loop, never commits.
argument-hint: "[the subject – a file path, a topic, pasted text; defaults to what the conversation was last about]"
---

# Explain simply

Explains one subject in plain language, a layer at a time, in the conversation: a TL;DR first, then one more paragraph of detail each time the user asks for more, until nothing is left to add or the user moves on. It writes no file.

## Subject

$ARGUMENTS

The thing to explain: a file path, a URL or document already in context, a topic name, or pasted text. A path is read before anything is written; anything else is taken as given. When empty, the subject is whatever the conversation was last about – the file, change, error or idea most recently discussed. The first line of the reply names the subject taken, so a wrong guess costs one turn.

## Steps

1. **Resolve the subject.** Read a path the argument names; otherwise take the argument, or the conversation's most recent subject when it is empty. Open the reply with one line naming what is being explained.
2. **TL;DR.** One paragraph of two to four sentences: what the subject is and why it matters, in everyday words. No heading, no list. Then, on its own line, ask verbatim: *Do you want me to expand upon this further?*
3. **Expand.** On a yes, write one paragraph of four to six sentences adding one new layer: the most important detail not yet covered, so a user who breaks out early still has the part that matters most. Never restate an earlier paragraph. Ask the same question again on its own line, unless step 5 applies.
4. **Read the reply.** A yes expands: back to step 3. A question about the subject is answered in the same plain register, then the expand question is asked again. Anything else – a no, a new topic, an instruction to do something – is a breakout: stop without comment and handle the message as it would be handled outside the skill.
5. **Close.** When the paragraph just written added the last detail worth adding, say in a line that the subject is now fully covered instead of asking again. Nothing is written, so nothing is left uncommitted.

## Rules

- Plain language in every paragraph, not only the first. Each one is written for a reader with no background in the field: no jargon, no unexpanded acronym, and a term the subject needs is explained in everyday words the first time it appears. Depth comes from more detail, never from harder words.
- Never pads. A layer is written only while there is a detail worth adding; the skill, not the user, says when the subject is covered.
- One question per turn, always the same one, always after the paragraph.
- In a run declared unattended the TL;DR is the whole reply: no expand question, no layers. The driver's framing is the only signal.
- Never edits a file, never changes the subject mid-loop, never commits.
