---
title: What I mean by AI systems engineering
description: A draft on the difference between calling a model and operating one. Traces, evals, and a gate in front of any write.
date: 2026-11-12
draft: true
---

A model call is not a system. The call is the small part. The system is everything that has to stay true when the call is late, wrong, or confidently wrong: what it was allowed to see, what it did with the tools, and who is permitted to act on the answer.

I use “AI systems engineering” for that surrounding work. It sits next to software engineering, not instead of it. The habits are the same ones you already want from a service that can page you. They just get skipped when a demo ends at the chat box.

## The parts I refuse to treat as optional

**A trace.** If you cannot reconstruct the tool calls, you cannot explain a failure. A single final string is not a trace. The inputs, the tool names, the timeouts, and the draft that was rejected all belong in the record.

**A set you own.** Evaluation against whatever happened to be in the prompt last Tuesday will tell you that last Tuesday still works. A small set of cases, added on purpose, will tell you when a change breaks a promise. Production logs are a source of ideas for cases. They are not the set.

**A gate that fails closed.** A missing score is not a pass. An errored runner is not a pass. If the harness cannot produce a report, the candidate does not advance. This is the unglamorous half of “we evaluate our agents.”

**A person on the write.** Drafting a GitHub issue, a status, or a message is a reasonable thing to hand a model. Sending it is not. The [triage study](/work/feedback-triage/) is that split, drawn as an architecture rather than a slogan. The [eval gate](/work/agent-evals/) is the harness I want in front of the drafter.

## What I am not claiming

This note does not report a precision, a latency, or a team size. I have not put a number here because I am not going to invent one for a sample draft. If a real harness replaces the study, the note should be rewritten to match it, or deleted.

The useful test is boring: can a new person read the trace of a failed case and see which promise broke, without asking the model to explain itself? If the answer is no, the system is not finished, however fluent the happy path was.
