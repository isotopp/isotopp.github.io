---
author: isotopp
date: "2026-02-25T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - data center
  - erklaerbaer
  - lang_en
title: "Physics of Data Centers in Space"
---

Did it ever occur to you why your computer has a fan,
and why that fan usually stays quiet until the machine actually starts doing something?

# Compute means Heat

When your laptop sits idle, very little is happening electrically.
Modern processors are extremely aggressive about *not* working unless they have to.
Large parts of the chip are clock-gated or power-gated entirely.
No clock edges means no switching.
No switching means almost no dynamic power use.
At idle, a modern CPU is mostly just maintaining state, sipping energy to keep memory alive and respond to interrupts.

The moment real work starts, that changes.

Every clock tick forces millions or billions of transistors to switch, charge and discharge tiny capacitors,
and move electrons through resistive paths.
That switching energy turns directly into heat.
More clock cycles per second means more switching.
More switching means more heat.
Clock equals work, and work equals heat.

This is why performance and temperature rise together.
When you compile code, render video, or train a model, the clock ramps up, voltage often increases,
and the chip suddenly dissipates tens or hundreds of watts instead of one or two watts.

The fan turns on because physics makes this unavoidable.

# Hot Silicon is inefficient

Even when transistors are not switching, hot silicon still consumes power.
As temperature increases, leakage currents increase exponentially.
Electrons start slipping through transistors that are supposed to be off.
This leakage does no useful work.
It simply generates more heat, which increases temperature further, which increases leakage again.
This feedback loop is one of the reasons temperature limits exist at all, and ultimately why we have fans –
to keep the system under load below this critical temperature.

Above roughly 100ºC, this leakage becomes a serious design concern for modern chips.
Silicon melts only above 1400ºC, but efficiency collapses much earlier, at 100ºC.

You spend more and more energy just keeping the circuit alive, not computing.
To compensate, designers must lower clock speeds, increase timing margins, or raise voltage,
all of which reduce performance per watt.

Reliability also suffers.
High temperature accelerates wear mechanisms inside the chip.
Metal atoms in interconnects slowly migrate.
Insulating layers degrade.
Transistors age faster.
A chip running hot all the time will not live as long as one kept cooler, even if it technically functions.

# Performance depends on Cooling

This is why cooling exists, and why it scales with workload:
It exists to keep the chip in a temperature range where switching dominates over leakage,
where clocks can run fast without excessive voltage, and where the hardware will still be alive years from now.

In space, where you cannot rely on air or liquid to carry heat away, this tradeoff becomes unavoidable and very visible.

- Run hotter, and you can radiate heat more easily.
- Run hotter, and your electronics become slower, leakier, and shorter-lived.

# Raditation outside of the Magnetosphere

On Earth, live and electronics get to pretend the universe is gentle: 
We sit under a magnetic cocoon.

The Earths magnetic field bends and corrals a lot of charged particles
that would otherwise slam into the atmosphere and the ground.
The polar lights are indicative of particles
which hit the upper atmosphere and dump energy there instead of into your laptop or your DNA.

Low Earth Orbit (LEO) is still inside much of that protective bottle.
It is not deep space: most of the time you are still inside the magnetosphere,
but you pass through regions where trapped particles dip closer to Earth.
The South Atlantic Anomaly is the famous example, a patch where satellites see a much higher rate of hits.
Operators notice because sensors glitch, memory errors spike, and instruments get noisy.

Go higher and the protection changes.
The Van Allen belts are zones of trapped particles shaped by the magnetic field.
They sit above typical LEO altitudes and below geostationary orbit.

Geostationary orbit is far outside LEO,
and you spend much more time in harsher particle populations and different dose conditions.

Radiation matters because a modern chip is a giant field of tiny, delicate transistors storing tiny amounts of charge.
A single energetic particle can change how or even if that works.

- Bit flips: A particle passes through silicon, leaves a trail of charge,
and a memory cell or latch interprets that as a 0 becoming a 1.
That is a single event upset.
It does not break the chip, it just corrupts state.
The usual defense is error detection and correction, ECC in memory, parity, scrubbing, retries,
and lots of "trust but verify" in data paths.
That defense costs area, power, and latency.
You carry more bits than you asked for, you spend cycles checking them, and you sometimes redo work.
- Latchup and destructive events:
Some particle strikes can trigger parasitic structures in CMOS so a section of the chip effectively shorts power to ground, it is stuck at a 0 or a 1 permanently and no longer switches.
If you are lucky, the system detects it and power cycles that block.
If you are unlucky, you get local overheating and permanent damage.
The defense here is design techniques, guard rings, current limiting, fast power cutoffs, and redundancy.
Redundancy costs density.
You either duplicate blocks so you can route around a failed one,
or you accept that some percentage of silicon will be lost over mission life and you overprovision from day one.
- Total ionizing dose: Ionizing radiation gradually traps charge in insulating layers and at interfaces.
Threshold voltages shift, leakage rises, timing changes, noise margins shrink,
and eventually the chip that used to pass validation at room temperature starts failing at its corners where radiation hits strongest.
This is why space hardware often talks about dose ratings and mission lifetimes, not just "it works today."
The defenses are process choices, device layout choices, and again, guardbands.

# How does space hardware survive?

Shielding and Redundant Design.

- Put material around the electronics, often aluminum as a structural and shielding compromise.
It helps, but mass is the tax you pay forever.
It also only helps a bit: High energy particles penetrate a lot of material,
and some shielding configurations create secondary particles when the primary hits the shield.
You can reduce dose and upset rates, you cannot build a perfect bunker without turning your satellite into a brick.
- A lot of rad hard parts use larger transistors, older process nodes, thicker oxides, and conservative voltages.
Larger devices store more charge, so a stray deposit is less likely to flip a bit.
Thicker insulators tolerate more ionization.
Conservative voltages and clocks give you more timing margin as the device ages.
All of this makes the chip slower and bigger for the same function.
- On top of that, Logic level hardening, software paranoia.
ECC everywhere.
Voters and triplication for critical state,
triple modular redundancy where you do the same computation three times and take the majority result.
Watchdogs, reset domains, isolation boundaries, and constant self checking.
You get correctness, but you spend transistors and joules on distrust.

Every one of these defenses hits the same three budgets.

- Area goes up because you replicate circuits and add check bits and voters.

- Power goes up because more circuitry toggles,
and because robust designs often run at higher voltages than bleeding edge consumer silicon.

Speed goes down because checking takes time, retries take time, and wide safety margins force lower clocks.

Space hardened electronics is built for survival, not speed.
It is very reliable, and slow as fuck.

# What does that mean for AI in Space?

If we hold all that against a H100 GPU as is being used for AI,
we can see that this is a lost cause without launching any satellite.

The H100s GH100 die is about 814 mm2 on TSMC 4N with about 80 billion transistors.

This kind of die does not fly into space and survives longer than an afternoon.

[A 65nm hardened ASIC technology for
Space applications](https://indico.esa.int/event/165/contributions/1218/attachments/1205/1425/05b_-_KIPSAT_-_Presentation.pdf) ESA PDF from 2017.

ESA talks about 65nm processes, 16 times larger structures than what powers a H100, 250 times larger area structures,
for their space hardened compute.

The same amount of transistors for a H100 would be a 0.2 m^2 slab,
which also means that energy goes up and clock goes down, down, down.

Some compute in space runs on 28 nm structures, so a 50x times area increase compared to a H100.
That's 40.000 mm^2 for the same amount of transistors.

Or, in other words, a GPU does not work in space.

At all.

# Redundancy costs (Factor 3)

If you try, 80 bn transistors become around 25 bn transistors for overhead (n = 3) and redundant reserve.

So even if you sent a 4 nm node chip into space, it's no longer an 80 bn monster,
but only a relatively modest 25 bn transistor GPU fragment.

Running hotter cools better, to the fourth power.
So even relatively modest temperature increases will pay of big time in terms of radiative cooling (100ºC -> 120ºC),
but that means more leakage, more power, less clock.
So your 25 bn transistors net capacity will calculate slower than on earth.

A GPU does not work in space.

# So you have a DC in Space, what now.

We can now talk about bandwidth, latency and spectrum carrying capacity,
because we also want to TALK to those data centers from earth, but that's kind of a moot point already.
If it's a LEO data center, it does move across the sky relatively quickly.
It will be in range for a few minutes every 1.5 hours or so.
Or you track it as it circles the earth, using up earthbound communication capacity, and paying latency cost.

We can then talk about launch costs, kilograms, lifetime, and the atmospheric effects of that material on re-entry,
but it will never come to that.
